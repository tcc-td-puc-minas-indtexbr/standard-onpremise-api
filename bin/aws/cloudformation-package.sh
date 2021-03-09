echo "AWS Account: $1"
echo "cloudformation package --template-file sam.yml --s3-bucket generic-lambda-builds --output-template-file packaged.yml --profile tcc-td-puc-minas-admin"
aws cloudformation package --template-file sam.yml --s3-bucket generic-lambda-builds --output-template-file packaged.yml --profile tcc-td-puc-minas-admin
