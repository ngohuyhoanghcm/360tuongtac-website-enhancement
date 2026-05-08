#!/usr/bin/env python3
import subprocess
result = subprocess.run([
    'ssh', '-p', '2277', '-i', 'C:\\temp\\geminivideo_deploy.pem',
    'deploy@14.225.224.130',
    'curl -s http://localhost:3001/api/admin/health'
], capture_output=True, text=True)
print("Health check:", result.stdout)
