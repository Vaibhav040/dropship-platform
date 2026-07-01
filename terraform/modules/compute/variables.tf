variable "environment" {
  description = "The environment name (e.g., dev, prod)"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID from the networking module"
  type        = string
}

variable "private_subnets" {
  description = "Private subnets for the worker nodes"
  type        = list(string)
}

variable "public_subnets" {
  description = "Public subnets for the control plane"
  type        = list(string)
}

variable "instance_types" {
  description = "The EC2 instance types for the worker nodes"
  type        = list(string)
  default     = ["m7i-flex.large"]
}