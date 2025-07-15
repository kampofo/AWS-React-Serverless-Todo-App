# create_task lambda
resource "aws_lambda_function" "create_task" {
  function_name = "create-task"
  handler       = "createTask.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn

  filename         = "${path.module}/../backend/dist-zips/createTask.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist-zips/createTask.zip")

  environment {
    variables = {
      DB_HOST     = aws_db_instance.todo_postgres.address
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}

# get_task lambda
resource "aws_lambda_function" "get_tasks" {
  function_name = "get-tasks"
  handler       = "getTasks.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn

  filename         = "${path.module}/../backend/dist-zips/getTasks.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist-zips/getTasks.zip")

  environment {
    variables = {
      DB_HOST     = aws_db_instance.todo_postgres.address
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}

# delete_task lambda
resource "aws_lambda_function" "delete_task" {
  function_name = "delete-task"
  handler       = "deleteTask.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn

  filename         = "${path.module}/../backend/dist-zips/deleteTask.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist-zips/deleteTask.zip")

  environment {
    variables = {
      DB_HOST     = aws_db_instance.todo_postgres.address
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}

# update_task lambda
resource "aws_lambda_function" "update_task" {
  function_name = "update-task"
  handler       = "updateTask.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn

  filename         = "${path.module}/../backend/dist-zips/updateTask.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/dist-zips/updateTask.zip")

  environment {
    variables = {
      DB_HOST     = aws_db_instance.todo_postgres.address
      DB_USER     = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}