#!/usr/bin/env python3
"""
Fix Docker env-file to escape $ signs in bcrypt hash
Docker env-file parser interprets $ as variable interpolation
Solution: Replace $ with $$ in bcrypt hash values
"""

import sys
import os

def fix_env_file(env_file_path):
    """Escape $ signs in bcrypt hashes in env file"""
    
    print(f"Reading {env_file_path}...")
    
    with open(env_file_path, 'r') as f:
        lines = f.readlines()
    
    fixed_lines = []
    changes_made = False
    
    for i, line in enumerate(lines, 1):
        # Check if line contains NEXT_ADMIN_PASSWORD_HASH
        if line.startswith('NEXT_ADMIN_PASSWORD_HASH='):
            # Extract the value
            key_value = line.split('=', 1)
            if len(key_value) == 2:
                value = key_value[1].strip().strip("'\"")
                
                # Check if it's a bcrypt hash (starts with $2b$)
                if value.startswith('$2b$'):
                    # Escape all $ signs by doubling them
                    escaped_value = value.replace('$', '$$')
                    
                    # Check if already escaped
                    if escaped_value != value:
                        fixed_lines.append(f"NEXT_ADMIN_PASSWORD_HASH='{escaped_value}'\n")
                        print(f"  Line {i}: Escaped $ signs in hash")
                        print(f"    Original: {value[:30]}...")
                        print(f"    Escaped:  {escaped_value[:35]}...")
                        changes_made = True
                    else:
                        fixed_lines.append(line)
                else:
                    fixed_lines.append(line)
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
    
    if changes_made:
        # Backup original
        backup_path = f"{env_file_path}.backup.{os.popen('date +%Y%m%d_%H%M%S').read().strip()}"
        os.system(f"cp {env_file_path} {backup_path}")
        print(f"\n  Backup created: {backup_path}")
        
        # Write fixed version
        with open(env_file_path, 'w') as f:
            f.writelines(fixed_lines)
        
        print(f"  ✅ File updated successfully!")
        return True
    else:
        print("  No changes needed")
        return False

if __name__ == '__main__':
    env_file = sys.argv[1] if len(sys.argv) > 1 else '/opt/360tuongtac/.env.production'
    
    if not os.path.exists(env_file):
        print(f"❌ Error: File {env_file} not found!")
        sys.exit(1)
    
    success = fix_env_file(env_file)
    sys.exit(0 if success else 1)
