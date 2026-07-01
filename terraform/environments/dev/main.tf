provider "aws" {
  region = "ap-south-1"
}

# NETWORKING LAYER

module "networking" {
  source = "../../modules/networking"

  environment     = "dev"
  vpc_cidr        = "10.0.0.0/16"
  azs             = ["ap-south-1a", "ap-south-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
}

# EKS LAYER

module "compute" {
  source = "../../modules/compute"

  environment     = "dev"
  
  vpc_id          = module.networking.vpc_id
  private_subnets = module.networking.private_subnets
  public_subnets  = module.networking.public_subnets
  
}