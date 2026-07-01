terraform {
    backend "s3" {
      bucket = "dropship-platform-terraform-state-30c107ca53f686e6e02bdb90a4"
      key = "dev/terraform.tfstate"
      region = "ap-south-1"
      dynamodb_table = "dropship-platform-terraform-locks"
      encrypt = true
    }
}