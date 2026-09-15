# ComplianceGuard - EC2 Deployment Guide with Docker Compose & GitHub Actions

This guide walks you through deploying **ComplianceGuard** (FastAPI Backend + React Frontend + PostgreSQL Database) to an **AWS EC2 instance** using **Docker Compose** and automated **GitHub Actions CI/CD**, accessible directly via your EC2 **Public IPv4 Address** without requiring a custom domain.

---

## 🏗️ Architecture Summary

```
                       ┌──────────────────────────────────────────────┐
                       │              AWS EC2 Instance                │
                       │             (Public IP Address)              │
                       │                                              │
Client's Browser ─────►│ Port 80: Nginx (Frontend Container)          │
http://<EC2_PUBLIC_IP> │  ├── Serves React Single Page Application    │
                       │  └── Reverse proxies /api/* ────────┐        │
                       │                                     ▼        │
                       │       Port 8000: FastAPI Backend Container   │
                       │                        │                     │
                       │                        ▼                     │
                       │       Port 5432: PostgreSQL Container        │
                       │                  (Persistent Volume)         │
                       └──────────────────────────────────────────────┘
```

- **Unified Port 80**: Both the React UI and FastAPI API are accessed through Port 80.
- **No CORS Issues**: Because the browser accesses both the website and API endpoints on the same origin (`http://<EC2_PUBLIC_IP>`), cross-origin restrictions are eliminated.
- **Dynamic IP Independent**: The frontend uses a relative `/api` path. If your EC2 instance is restarted and given a new public IP, the frontend **never breaks** and requires zero rebuilding.

---

## Step 1: Launch an AWS EC2 Instance

1. Log into your [AWS Management Console](https://console.aws.amazon.com/) and navigate to **EC2**.
2. Click **Launch Instance**.
3. Choose the following settings:
   - **Name**: `ComplianceGuard-Server`
   - **OS Image (AMI)**: **Ubuntu Server 24.04 LTS** or **Ubuntu 22.04 LTS** (64-bit x86).
   - **Instance Type**: `t3.small` or `t2.small` (2 GB RAM recommended for running Node build and Docker containers concurrently; if using `t2.micro` (1 GB RAM), ensure swap memory is enabled).
   - **Key Pair**: Select an existing `.pem` key or create a new key pair (e.g. `complianceguard-key.pem`) and download it to your machine.
   - **Storage**: Set storage to at least **20 GiB** (General Purpose SSD `gp3`).

---

## Step 2: Configure the EC2 Security Group

Under **Network Settings** > **Inbound security group rules**, configure:

| Type | Port Range | Source | Description |
| :--- | :--- | :--- | :--- |
| **SSH** | `22` | `0.0.0.0/0` (or your IP) | Required for SSH access and GitHub Actions CI/CD |
| **HTTP** | `80` | `0.0.0.0/0` | Web application traffic for all visitors |
| **Custom TCP** (Optional) | `8000` | `0.0.0.0/0` | Direct backend API / Swagger Docs (if desired) |

> [!IMPORTANT]
> Do **NOT** open Port `5432` (PostgreSQL) to `0.0.0.0/0`. The database runs safely inside the internal Docker network.

---

## Step 3: Connect to EC2 & Run the Initial Setup Script

1. Open your local terminal and navigate to where your `.pem` key is stored:
   ```bash
   chmod 400 complianceguard-key.pem
   ssh -i complianceguard-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

2. Once connected to your EC2 instance, run the automated setup script:
   ```bash
   # Clone the repository
   git clone https://github.com/RAHULku784/-ComplianceGuard.git ~/ComplianceGuard

   # Run the initialization script
   cd ~/ComplianceGuard
   chmod +x deploy/ec2-setup.sh
   ./deploy/ec2-setup.sh
   ```

3. Refresh your user session permissions (so Docker can run without `sudo`):
   ```bash
   newgrp docker
   ```

---

## Step 4: Configure GitHub Secrets for CI/CD

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret** and add the following 3 secrets:

### Secret 1: `EC2_HOST`
- **Value**: Your EC2 **Public IPv4 Address** or **Public IPv4 DNS** (e.g., `3.14.24.120` or `ec2-3-14-24-120.compute-1.amazonaws.com`).

### Secret 2: `EC2_USER`
- **Value**: `ubuntu` (default username for Ubuntu AMIs).

### Secret 3: `EC2_SSH_KEY`
- **Value**: The entire contents of your downloaded `.pem` private key file, including the header and footer lines:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEA...
  ...
  -----END RSA PRIVATE KEY-----
  ```
  *(Tip: Open the `.pem` file with a text editor or run `cat complianceguard-key.pem` on your laptop to copy the entire key)*.

---

## Step 5: Deploy the Project via CI/CD

Now, whenever you push code changes to the `main` branch, GitHub Actions will automatically:
1. Validate and test the frontend build and backend code.
2. Connect securely to your EC2 instance over SSH.
3. Pull the latest code and execute `docker compose up -d --build`.
4. Automatically initialize the PostgreSQL schema, create default roles, and seed demo records.

To trigger the first deployment:
```bash
git add .
git commit -m "Configure Docker Compose and GitHub Actions CI/CD for EC2 deployment"
git push origin main
```

You can also manually trigger a deployment at any time:
1. Navigate to your repository on GitHub.
2. Click the **Actions** tab.
3. Select **CI/CD Pipeline - Deploy to AWS EC2** on the left.
4. Click **Run workflow** > **Run workflow**.

---

## Step 6: Access & Verify the Application

Once the GitHub Actions workflow finishes (green checkmark):

1. **Web Dashboard**:
   Open in your browser:
   ```
   http://<YOUR_EC2_PUBLIC_IP>
   ```

2. **Login with Default Admin Credentials**:
   - **Email**: `admin@complianceguard.com`
   - **Password**: `admin123`

3. **FastAPI Swagger Docs**:
   ```
   http://<YOUR_EC2_PUBLIC_IP>/docs
   ```

---

## Useful Maintenance Commands on EC2

To manage or debug the application on your EC2 instance:

- **Check container status**:
  ```bash
  cd ~/ComplianceGuard && docker compose ps
  ```

- **View live backend logs**:
  ```bash
  cd ~/ComplianceGuard && docker compose logs -f backend
  ```

- **View live frontend (Nginx) logs**:
  ```bash
  cd ~/ComplianceGuard && docker compose logs -f frontend
  ```

- **Restart all services**:
  ```bash
  cd ~/ComplianceGuard && docker compose restart
  ```

- **Re-run seed data manually**:
  ```bash
  docker compose exec backend python seed_data.py
  ```

- **Check disk space**:
  ```bash
  docker system df
  ```
