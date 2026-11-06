# AWS Migration Guide - NUMU Moodle

## Pre-Migration Checklist

### Local Environment Preparation

- [ ] Backup completo de base de datos
- [ ] Backup de moodledata (archivos)
- [ ] Documentar configuraciones custom
- [ ] Listar plugins instalados
- [ ] Exportar temas personalizados
- [ ] Verificar versiones (PHP, PostgreSQL, Moodle)

### AWS Account Setup

- [ ] Crear cuenta AWS (si no existe)
- [ ] Configurar IAM users y roles
- [ ] Configurar billing alerts
- [ ] Crear VPC dedicado
- [ ] Configurar Security Groups

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Route 53 (DNS)                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│              CloudFront (CDN)                           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│     Application Load Balancer (ALB)                     │
│              SSL Termination                            │
└──────────────┬─────────────────────┬────────────────────┘
               │                     │
    ┌──────────▼────────┐ ┌─────────▼──────────┐
    │  EC2 Instance 1   │ │  EC2 Instance 2    │
    │  (Auto Scaling)   │ │  (Auto Scaling)    │
    └──────┬────────────┘ └────────┬───────────┘
           │                       │
           └───────────┬───────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼────────┐
│ RDS PostgreSQL│ │ElastiCache│ │  S3 Bucket   │
│   Multi-AZ    │ │  Redis    │ │  (Files)     │
└───────────────┘ └───────────┘ └──────────────┘
```

## Step-by-Step Migration

### Phase 1: VPC and Networking

```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=numu-moodle-vpc}]'

# Create Subnets (Public and Private)
# Public Subnet 1 (us-east-1a)
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a

# Public Subnet 2 (us-east-1b)
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b

# Private Subnet 1 (us-east-1a)
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.10.0/24 \
  --availability-zone us-east-1a

# Private Subnet 2 (us-east-1b)
aws ec2 create-subnet \
  --vpc-id vpc-xxxxx \
  --cidr-block 10.0.11.0/24 \
  --availability-zone us-east-1b

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway \
  --vpc-id vpc-xxxxx \
  --internet-gateway-id igw-xxxxx
```

### Phase 2: RDS PostgreSQL

```bash
# Create DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name numu-moodle-db-subnet \
  --db-subnet-group-description "NUMU Moodle DB Subnet" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create RDS Instance
aws rds create-db-instance \
  --db-instance-identifier numu-moodle-db \
  --db-instance-class db.t3.large \
  --engine postgres \
  --engine-version 15.4 \
  --master-username moodle_admin \
  --master-user-password 'STRONG_PASSWORD_HERE' \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --multi-az \
  --db-subnet-group-name numu-moodle-db-subnet \
  --vpc-security-group-ids sg-xxxxx \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --publicly-accessible false
```

**Import Database:**

```bash
# Export from local
docker exec numu_moodle_db pg_dump -U moodle_user moodle_numu > moodle_export.sql

# Import to RDS
psql -h numu-moodle-db.xxxxx.us-east-1.rds.amazonaws.com \
     -U moodle_admin \
     -d moodle_numu \
     -f moodle_export.sql
```

### Phase 3: ElastiCache Redis

```bash
# Create Cache Subnet Group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name numu-moodle-cache-subnet \
  --cache-subnet-group-description "NUMU Moodle Cache" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create Redis Cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id numu-moodle-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-subnet-group-name numu-moodle-cache-subnet \
  --security-group-ids sg-xxxxx \
  --port 6379
```

### Phase 4: S3 Storage

```bash
# Create S3 Bucket
aws s3 mb s3://numu-moodle-files --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket numu-moodle-files \
  --versioning-configuration Status=Enabled

# Set lifecycle policy (optional)
aws s3api put-bucket-lifecycle-configuration \
  --bucket numu-moodle-files \
  --lifecycle-configuration file://lifecycle.json

# Sync local moodledata to S3
aws s3 sync ./moodledata/filedir s3://numu-moodle-files/filedir
```

**lifecycle.json:**
```json
{
  "Rules": [
    {
      "Id": "Move old files to Glacier",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

### Phase 5: EC2 Instances

**Create AMI:**

```bash
# Install dependencies on base Amazon Linux 2023
sudo yum update -y
sudo yum install -y httpd php8.2 php8.2-pgsql php8.2-redis php8.2-gd \
  php8.2-xml php8.2-mbstring php8.2-zip php8.2-intl php8.2-soap \
  php8.2-opcache git

# Install Moodle
cd /var/www/html
sudo git clone -b MOODLE_404_STABLE https://github.com/moodle/moodle.git .

# Copy custom theme and plugins
sudo cp -r /path/to/theme/numu_cyber /var/www/html/theme/
sudo cp -r /path/to/local/numu_integration /var/www/html/local/

# Configure Apache
sudo systemctl enable httpd
sudo systemctl start httpd

# Create AMI from this instance
aws ec2 create-image \
  --instance-id i-xxxxx \
  --name "numu-moodle-ami-v1" \
  --description "NUMU Moodle with custom theme and plugins"
```

**Launch Template:**

```bash
aws ec2 create-launch-template \
  --launch-template-name numu-moodle-template \
  --version-description "v1.0" \
  --launch-template-data '{
    "ImageId": "ami-xxxxx",
    "InstanceType": "t3.large",
    "KeyName": "numu-moodle-key",
    "SecurityGroupIds": ["sg-xxxxx"],
    "IamInstanceProfile": {
      "Name": "numu-moodle-ec2-role"
    },
    "UserData": "BASE64_ENCODED_STARTUP_SCRIPT"
  }'
```

**Auto Scaling Group:**

```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name numu-moodle-asg \
  --launch-template LaunchTemplateName=numu-moodle-template,Version='$Latest' \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --target-group-arns arn:aws:elasticloadbalancing:... \
  --health-check-type ELB \
  --health-check-grace-period 300 \
  --vpc-zone-identifier "subnet-xxxxx,subnet-yyyyy"
```

### Phase 6: Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name numu-moodle-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application

# Create Target Group
aws elbv2 create-target-group \
  --name numu-moodle-tg \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-xxxxx \
  --health-check-path /admin/cli/healthcheck.php \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create Listener (HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### Phase 7: CloudFront CDN

```bash
# Create CloudFront Distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**
```json
{
  "CallerReference": "numu-moodle-2026",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "numu-moodle-alb",
        "DomainName": "numu-moodle-alb-xxxxx.us-east-1.elb.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "https-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "numu-moodle-alb",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 7,
      "Items": ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true
}
```

### Phase 8: Route 53 DNS

```bash
# Create Hosted Zone (if not exists)
aws route53 create-hosted-zone \
  --name numu.com \
  --caller-reference 2026-01-27

# Create A Record pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://dns-record.json
```

**dns-record.json:**
```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "learn.numu.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d1234567890.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
```

## Configuration Updates

### Update config.php for AWS

```php
<?php
// Database (RDS)
$CFG->dbhost    = 'numu-moodle-db.xxxxx.us-east-1.rds.amazonaws.com';
$CFG->dbname    = 'moodle_numu';
$CFG->dbuser    = 'moodle_admin';
$CFG->dbpass    = getenv('DB_PASSWORD'); // Use Secrets Manager

// Redis (ElastiCache)
$CFG->session_redis_host = 'numu-moodle-redis.xxxxx.cache.amazonaws.com';

// S3 Storage (requires plugin)
$CFG->alternative_file_system_class = '\\tool_objectfs\\s3_file_system';

// URLs
$CFG->wwwroot   = 'https://learn.numu.com';

// SSL Proxy
$CFG->sslproxy = true;
$CFG->reverseproxy = true;

// Production settings
$CFG->debug = 0;
$CFG->debugdisplay = 0;
```

## Monitoring and Alerts

### CloudWatch Alarms

```bash
# CPU Utilization
aws cloudwatch put-metric-alarm \
  --alarm-name numu-moodle-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Database Connections
aws cloudwatch put-metric-alarm \
  --alarm-name numu-moodle-db-connections \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 150 \
  --comparison-operator GreaterThanThreshold
```

## Cost Optimization

### Reserved Instances

- **EC2:** Purchase 1-year Reserved Instances (save ~40%)
- **RDS:** Purchase 1-year Reserved Instances (save ~35%)

### Auto Scaling Policies

```bash
# Scale up policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name numu-moodle-asg \
  --policy-name scale-up \
  --scaling-adjustment 2 \
  --adjustment-type ChangeInCapacity \
  --cooldown 300

# Scale down policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name numu-moodle-asg \
  --policy-name scale-down \
  --scaling-adjustment -1 \
  --adjustment-type ChangeInCapacity \
  --cooldown 300
```

## Backup Strategy

### Automated Backups

- **RDS:** Automated daily backups (7-day retention)
- **S3:** Versioning enabled + lifecycle policies
- **EC2:** Weekly AMI snapshots

### Disaster Recovery

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier numu-moodle-db \
  --db-snapshot-identifier numu-moodle-snapshot-$(date +%Y%m%d)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier numu-moodle-db-restored \
  --db-snapshot-identifier numu-moodle-snapshot-20260127
```

## Security Hardening

### IAM Roles

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::numu-moodle-files/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:numu-moodle-*"
    }
  ]
}
```

### Security Groups

**ALB Security Group:**
- Inbound: 443 (HTTPS) from 0.0.0.0/0
- Outbound: All traffic

**EC2 Security Group:**
- Inbound: 80 (HTTP) from ALB SG only
- Outbound: All traffic

**RDS Security Group:**
- Inbound: 5432 (PostgreSQL) from EC2 SG only
- Outbound: None

**ElastiCache Security Group:**
- Inbound: 6379 (Redis) from EC2 SG only
- Outbound: None

## Post-Migration Checklist

- [ ] Verificar conectividad a RDS
- [ ] Verificar conectividad a Redis
- [ ] Verificar acceso a S3
- [ ] Probar login de usuarios
- [ ] Verificar carga de archivos
- [ ] Ejecutar cron jobs
- [ ] Verificar envío de emails
- [ ] Testing de performance (JMeter)
- [ ] Configurar backups automáticos
- [ ] Configurar CloudWatch alarms
- [ ] Actualizar DNS (Route 53)
- [ ] Verificar SSL/HTTPS
- [ ] Testing de Auto Scaling
- [ ] Documentar runbooks

## Estimated Timeline

- **Week 1:** VPC, RDS, ElastiCache setup
- **Week 2:** S3, EC2 AMI creation
- **Week 3:** ALB, Auto Scaling, CloudFront
- **Week 4:** Testing, optimization, DNS cutover

## Estimated Costs (Monthly)

| Service | Configuration | Cost |
|---------|--------------|------|
| EC2 (Reserved) | 2x t3.large | $90 |
| RDS (Reserved) | db.t3.large Multi-AZ | $140 |
| ElastiCache | cache.t3.medium | $60 |
| S3 | 500GB + transfer | $30 |
| CloudFront | 1TB transfer | $50 |
| Route 53 | 1 hosted zone | $1 |
| ALB | Standard | $25 |
| Data Transfer | 1TB/month | $90 |
| **TOTAL** | | **~$486/month** |

## Rollback Plan

If migration fails:

1. Keep local environment running during migration
2. DNS cutover is last step (easy rollback)
3. RDS snapshots before any changes
4. S3 versioning allows file recovery
5. Document all AWS resource IDs for cleanup

## Support Resources

- AWS Support: Premium tier recommended
- Moodle Partners: Consider hiring for migration assistance
- Internal team: DevOps + DBA required

---

**Last Updated:** 2026-01-27
**Version:** 1.0
**Author:** NUMU DevOps Team
