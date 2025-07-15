provider "aws" {
  region = "us-east-1" # Or your preferred region
}

# Create a security group to allow inbound PostgreSQL traffic
resource "aws_security_group" "rds_sg" {
  name        = "todoapp-rds-sg"
  description = "Allow PostgreSQL inbound traffic"

  ingress {
    description = "PostgreSQL from anywhere (DEV ONLY)"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # 👈 DEV ONLY! Restrict in production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# PostgreSQL RDS instance (Free Tier eligible)
resource "aws_db_instance" "todo_postgres" {
  identifier = "todo-postgres-db"

  # Free‑Tier class
  instance_class = "db.t3.micro"

  engine = "postgres"
  # engine_version        = "15.5"   # optional—omit for latest

  db_name = "todoappdb" # ← was `name`

  username = var.db_username
  password = var.db_password # move to Secrets Manager later

  allocated_storage      = 20   # GB
  publicly_accessible    = true # lock down in prod
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  skip_final_snapshot = true
}

resource "aws_iam_role" "lambda_role" {
  name = "todo-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
