provider "aws" {
  region = var.aws_region
}

# ==============================================================================
# PART 1: THE LOGGING BUCKET
# ==============================================================================

resource "aws_s3_bucket" "terraform_state_logs" {
  bucket_prefix = "${var.project_name}-state-logs-"

  lifecycle {
    prevent_destroy = true
  }
}

# Encrypt the log bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_logs_crypto" {
  bucket = aws_s3_bucket.terraform_state_logs.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Log bucket must log its own access
resource "aws_s3_bucket_logging" "terraform_state_logs_logging" {
  bucket        = aws_s3_bucket.terraform_state_logs.id
  target_bucket = aws_s3_bucket.terraform_state_logs.id
  target_prefix = "log-bucket-access-logs/"
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "terraform_state_logs_access" {
  bucket                  = aws_s3_bucket.terraform_state_logs.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

# Enforce HTTPS-only for the log bucket
data "aws_iam_policy_document" "force_ssl_logs" {
  statement {
    sid     = "AllowSSLRequestsOnlyForLogs"
    effect  = "Deny"
    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.terraform_state_logs.arn,
      "${aws_s3_bucket.terraform_state_logs.arn}/*"
    ]
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "terraform_state_logs_force_ssl" {
  bucket = aws_s3_bucket.terraform_state_logs.id
  policy = data.aws_iam_policy_document.force_ssl_logs.json
}

# ==============================================================================
# PART 2: THE MAIN STATE BUCKET
# ==============================================================================

resource "aws_s3_bucket" "terraform_state" {
  bucket_prefix = "${var.project_name}-terraform-state-"

  lifecycle {
    prevent_destroy = true
  }
}

# Enable versioning for state rollback
resource "aws_s3_bucket_versioning" "terraform_state_versioning" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Encrypt the state bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_crypto" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# State bucket must send its logs to the logging bucket
resource "aws_s3_bucket_logging" "terraform_state_logging" {
  bucket        = aws_s3_bucket.terraform_state.id
  target_bucket = aws_s3_bucket.terraform_state_logs.id
  target_prefix = "state-logs/"
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "terraform_state_access" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

# Enforce HTTPS-only for the state bucket
data "aws_iam_policy_document" "force_ssl" {
  statement {
    sid     = "AllowSSLRequestsOnly"
    effect  = "Deny"
    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.terraform_state.arn,
      "${aws_s3_bucket.terraform_state.arn}/*"
    ]
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "terraform_state_force_ssl" {
  bucket = aws_s3_bucket.terraform_state.id
  policy = data.aws_iam_policy_document.force_ssl.json
}

# ==============================================================================
# PART 3: THE DYNAMODB LOCK TABLE
# ==============================================================================

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "${var.project_name}-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  # Added Security: Point-in-time recovery for DynamoDB
  point_in_time_recovery {
    enabled = true
  }
}