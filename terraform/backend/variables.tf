variable "aws_region" {
  description = "AWS region to deploy the remote state infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Core name for project"
  type        = string
  default     = "dropship-platform"
}