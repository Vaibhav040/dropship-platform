module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "dropship-${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  
  # Enterprise Logic: Force single NAT gateway for Dev to save money, 
  # but use highly-available multiple NATs for Prod.
  single_nat_gateway = var.environment == "dev" ? true : false

  # Mandatory tagging for cost-tracking
  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}