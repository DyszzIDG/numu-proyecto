# CSIRT Tools - MVP Documentation

## 📦 Installed Tools

This document provides usage examples and documentation for the 10 essential CSIRT security tools.

---

## 1. 🗺️ Nmap - Network Scanner

**Purpose**: Network discovery and security auditing

**Container**: `csirt-nmap`

**Basic Usage**:
```bash
# Quick scan
docker-compose run nmap -sV scanme.nmap.org

# Full TCP scan
docker-compose run nmap -p- -sV -sC target.com

# UDP scan
docker-compose run nmap -sU -p 53,161,162 target.com

# OS detection
docker-compose run nmap -O target.com
```

**Common Options**:
- `-sV`: Version detection
- `-sC`: Default scripts
- `-p-`: All ports
- `-O`: OS detection
- `-A`: Aggressive scan

**Documentation**: https://nmap.org/book/man.html

---

## 2. ⚡ Nuclei - Vulnerability Scanner

**Purpose**: Fast and customizable vulnerability scanner

**Container**: `csirt-nuclei`

**Basic Usage**:
```bash
# Update templates
docker-compose run nuclei -update-templates

# Scan with all templates
docker-compose run nuclei -u https://example.com

# Scan with specific severity
docker-compose run nuclei -u https://example.com -severity critical,high

# Scan with specific tags
docker-compose run nuclei -u https://example.com -tags cve,oast

# Output to file
docker-compose run nuclei -u https://example.com -o /output/results.txt
```

**Common Tags**:
- `cve`: CVE-based templates
- `oast`: Out-of-band templates
- `sqli`: SQL injection
- `xss`: Cross-site scripting

**Documentation**: https://nuclei.projectdiscovery.io/

---

## 3. 🕷️ Nikto - Web Scanner

**Purpose**: Web server vulnerability scanner

**Container**: `csirt-nikto`

**Basic Usage**:
```bash
# Basic scan
docker-compose run nikto -h http://example.com

# SSL scan
docker-compose run nikto -h https://example.com -ssl

# Scan with specific plugins
docker-compose run nikto -h http://example.com -Plugins headers

# Save output
docker-compose run nikto -h http://example.com -o /tmp/nikto-results.txt
```

**Common Options**:
- `-h`: Target host
- `-ssl`: Force SSL
- `-Plugins`: Specific plugins
- `-Tuning`: Scan tuning

**Documentation**: https://github.com/sullo/nikto

---

## 4. 💉 SQLMap - SQL Injection Scanner

**Purpose**: Automatic SQL injection detection and exploitation

**Container**: `csirt-sqlmap`

**Basic Usage**:
```bash
# Basic scan
docker-compose run sqlmap -u "http://example.com/page?id=1"

# POST request
docker-compose run sqlmap -u "http://example.com/login" --data="user=admin&pass=admin"

# Enumerate databases
docker-compose run sqlmap -u "http://example.com/page?id=1" --dbs

# Dump specific database
docker-compose run sqlmap -u "http://example.com/page?id=1" -D database_name --dump

# Batch mode (non-interactive)
docker-compose run sqlmap -u "http://example.com/page?id=1" --batch
```

**Common Options**:
- `-u`: Target URL
- `--data`: POST data
- `--dbs`: Enumerate databases
- `--tables`: Enumerate tables
- `--dump`: Dump data

**Documentation**: https://sqlmap.org/

---

## 5. 📁 Gobuster - Directory/DNS Bruteforcer

**Purpose**: Directory and DNS subdomain bruteforcing

**Container**: `csirt-gobuster`

**Basic Usage**:
```bash
# Directory bruteforce
docker-compose run gobuster dir -u http://example.com -w /wordlists/common.txt

# DNS subdomain enumeration
docker-compose run gobuster dns -d example.com -w /wordlists/subdomains.txt

# Vhost bruteforce
docker-compose run gobuster vhost -u http://example.com -w /wordlists/vhosts.txt

# With extensions
docker-compose run gobuster dir -u http://example.com -w /wordlists/common.txt -x php,html,txt
```

**Common Options**:
- `dir`: Directory mode
- `dns`: DNS mode
- `vhost`: Virtual host mode
- `-w`: Wordlist
- `-x`: File extensions

**Documentation**: https://github.com/OJ/gobuster

---

## 6. 🌾 theHarvester - OSINT Tool

**Purpose**: Email, subdomain, and information gathering

**Container**: `csirt-theharvester`

**Basic Usage**:
```bash
# Search with Google
docker-compose run theharvester -d example.com -b google

# Search with multiple sources
docker-compose run theharvester -d example.com -b google,bing,linkedin

# Limit results
docker-compose run theharvester -d example.com -b google -l 100

# Save to file
docker-compose run theharvester -d example.com -b google -f /output/results
```

**Common Sources**:
- `google`: Google search
- `bing`: Bing search
- `linkedin`: LinkedIn
- `shodan`: Shodan
- `all`: All sources

**Documentation**: https://github.com/laramies/theHarvester

---

## 7. 🔬 YARA - Malware Pattern Scanner

**Purpose**: Pattern matching for malware research

**Container**: `csirt-yara`

**Basic Usage**:
```bash
# Scan file with rule
docker-compose run yara /rules/malware.yar /samples/suspicious.exe

# Scan directory recursively
docker-compose run yara -r /rules/malware.yar /samples/

# Fast mode
docker-compose run yara -f /rules/malware.yar /samples/file.exe

# Print strings
docker-compose run yara -s /rules/malware.yar /samples/file.exe
```

**Common Options**:
- `-r`: Recursive
- `-f`: Fast mode
- `-s`: Print strings
- `-w`: Disable warnings

**Documentation**: https://yara.readthedocs.io/

---

## 8. 🛡️ Lynis - Security Auditing Tool

**Purpose**: System security auditing and hardening

**Container**: `csirt-lynis`

**Basic Usage**:
```bash
# Full system audit
docker-compose run lynis audit system

# Quick audit
docker-compose run lynis audit system --quick

# Specific tests
docker-compose run lynis audit system --tests-from-group malware

# Generate report
docker-compose run lynis audit system --report-file /tmp/lynis-report.txt
```

**Common Options**:
- `audit system`: System audit
- `--quick`: Quick scan
- `--tests-from-group`: Specific test groups
- `--report-file`: Output file

**Documentation**: https://cisofy.com/lynis/

---

## 9. 📊 Wazuh Agent - SIEM Agent

**Purpose**: Security monitoring and log analysis

**Container**: `csirt-wazuh-agent`

**Note**: Requires Wazuh Manager to be configured separately.

**Basic Setup**:
```bash
# Start agent
docker-compose up -d wazuh-agent

# View logs
docker-compose logs wazuh-agent

# Stop agent
docker-compose stop wazuh-agent
```

**Documentation**: https://documentation.wazuh.com/

---

## 10. 🔍 tshark - Network Protocol Analyzer

**Purpose**: Network traffic analysis (command-line Wireshark)

**Container**: `csirt-tshark`

**Basic Usage**:
```bash
# Capture packets
docker-compose run tshark -i eth0

# Capture to file
docker-compose run tshark -i eth0 -w /tmp/capture.pcap

# Read from file
docker-compose run tshark -r /tmp/capture.pcap

# Filter HTTP traffic
docker-compose run tshark -i eth0 -Y "http"

# Display specific fields
docker-compose run tshark -i eth0 -T fields -e ip.src -e ip.dst
```

**Common Filters**:
- `http`: HTTP traffic
- `tcp.port == 80`: Port 80
- `ip.addr == 192.168.1.1`: Specific IP
- `dns`: DNS traffic

**Documentation**: https://www.wireshark.org/docs/man-pages/tshark.html

---

## 🚀 Quick Start Guide

### 1. Install All Tools
```bash
cd csirt-tools
.\install-tools.ps1
```

### 2. Run a Tool
```bash
docker-compose run <tool-name> <arguments>
```

### 3. Example Workflow
```bash
# 1. Discover network
docker-compose run nmap -sV target.com

# 2. Scan for vulnerabilities
docker-compose run nuclei -u https://target.com

# 3. Web scanning
docker-compose run nikto -h https://target.com

# 4. Directory bruteforce
docker-compose run gobuster dir -u https://target.com -w /wordlists/common.txt

# 5. OSINT gathering
docker-compose run theharvester -d target.com -b google
```

---

## 📝 Best Practices

1. **Always get permission** before scanning targets
2. **Use rate limiting** to avoid overwhelming targets
3. **Save outputs** for documentation and reporting
4. **Update tools regularly** with `docker-compose pull`
5. **Review logs** after each scan
6. **Follow responsible disclosure** for found vulnerabilities

---

## 🔧 Troubleshooting

### Tool not working?
```bash
# Pull latest image
docker-compose pull <tool-name>

# Rebuild
docker-compose build <tool-name>

# Check logs
docker-compose logs <tool-name>
```

### Permission issues?
```bash
# Run with elevated privileges (if needed)
docker-compose run --user root <tool-name>
```

### Network issues?
```bash
# Use host network
docker-compose run --network host <tool-name>
```

---

## 📚 Additional Resources

- **NIST Cybersecurity Framework**: https://www.nist.gov/cyberframework
- **OWASP Testing Guide**: https://owasp.org/www-project-web-security-testing-guide/
- **MITRE ATT&CK**: https://attack.mitre.org/
- **CVE Database**: https://cve.mitre.org/

---

**Last Updated**: 2026-02-04
**Version**: 1.0 MVP
