module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "dropship-${var.environment}-cluster"
  cluster_version = "1.31"

  vpc_id                   = var.vpc_id
  subnet_ids               = var.private_subnets
  control_plane_subnet_ids = var.public_subnets

  cluster_endpoint_public_access = true
  enable_cluster_creator_admin_permissions = true

  eks_managed_node_groups = {
    app_nodes = {
      min_size     = 2
      max_size     = 4
      desired_size = 2
      
      instance_types = var.instance_types
    }
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}