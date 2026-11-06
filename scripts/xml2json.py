import sys
import json
import xml.etree.ElementTree as ET

def elem_to_dict(elem):
    """
    Convert an ElementTree element to a dictionary.
    """
    d = {}
    if elem.attrib:
        d.update(('@' + k, v) for k, v in elem.attrib.items())
    
    children = list(elem)
    if children:
        dd = {}
        for dc in map(elem_to_dict, children):
            for k, v in dc.items():
                if k in dd:
                    if isinstance(dd[k], list):
                        dd[k].append(v)
                    else:
                        dd[k] = [dd[k], v]
                else:
                    dd[k] = v
        d.update(dd)
    
    if elem.text:
        text = elem.text.strip()
        if children or elem.attrib:
            if text:
                d['#text'] = text
        else:
            return {elem.tag: text}
            
    return {elem.tag: d} if d else {elem.tag: None}

def parse_nmap_xml(root):
    """
    Specific parser for Nmap XML output to make it cleaner
    """
    result = {
        "nmaprun": {
            "@scanner": root.get("scanner"),
            "@args": root.get("args"),
            "@start": root.get("start"),
            "host": []
        }
    }
    
    for host in root.findall("host"):
        h = {"address": [], "ports": []}
        
        # Addresses
        for addr in host.findall("address"):
            h["address"].append({
                "@addr": addr.get("addr"),
                "@addrtype": addr.get("addrtype")
            })
            
        # Hostnames
        hostnames = host.find("hostnames")
        if hostnames is not None:
             h["hostnames"] = [hn.get("name") for hn in hostnames.findall("hostname")]
             
        # Ports
        ports = host.find("ports")
        if ports is not None:
            for port in ports.findall("port"):
                p = {
                    "@protocol": port.get("protocol"),
                    "@portid": port.get("portid"),
                    "state": port.find("state").get("state") if port.find("state") is not None else "unknown",
                    "service": {}
                }
                
                service = port.find("service")
                if service is not None:
                    p["service"] = {
                        "@name": service.get("name"),
                        "@product": service.get("product"),
                        "@version": service.get("version")
                    }
                    
                h["ports"].append(p)
                
        result["nmaprun"]["host"].append(h)
        
    return result

def main():
    try:
        content = sys.stdin.read()
        if not content.strip():
             return
        
        root = ET.fromstring(content)
        
        # Try simplified custom parser first for better utility
        try:
            result = parse_nmap_xml(root)
        except:
             # Fallback to generic if structure differs
            result = elem_to_dict(root)
            
        print(json.dumps(result, indent=2))
    except Exception as e:
        # Fallback raw output if xml parse fails
        error_json = {
            "error": str(e),
            "raw_output": content
        }
        print(json.dumps(error_json))

if __name__ == "__main__":
    main()
