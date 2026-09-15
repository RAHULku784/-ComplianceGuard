#!/bin/bash
# ==============================================================================
# ComplianceGuard - AWS EC2 One-Command Initial Setup Script
# Run this once on your newly launched EC2 instance (Ubuntu 22.04 or 24.04).
# ==============================================================================

set -e

echo "=========================================="
echo " Starting ComplianceGuard EC2 Setup"
echo "=========================================="

# 1. Update system packages
echo "--> Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Install prerequisites
echo "--> Installing prerequisites (git, curl, ca-certificates)..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

# 3. Add Docker's official GPG key and repository
echo "--> Configuring official Docker repository..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y

# 4. Install Docker Engine, containerd, and Docker Compose plugin
echo "--> Installing Docker Engine and Docker Compose..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Enable and start Docker service
echo "--> Enabling Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# 6. Add current user to docker group (so sudo is not needed for docker commands)
echo "--> Adding user $USER to docker group..."
sudo usermod -aG docker "$USER"

# 7. Clone repository if not already cloned
APP_DIR="$HOME/ComplianceGuard"
if [ ! -d "$APP_DIR" ]; then
    echo "--> Cloning repository into $APP_DIR..."
    git clone https://github.com/RAHULku784/-ComplianceGuard.git "$APP_DIR"
else
    echo "--> Repository already exists at $APP_DIR."
fi

echo "=========================================="
echo " EC2 Instance Setup Complete!"
echo "=========================================="
echo "IMPORTANT: Log out and log back in (or run 'newgrp docker') to apply docker permissions."
echo "You can now run: cd ~/ComplianceGuard && docker compose up -d --build"
