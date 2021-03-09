echo "AWS Account: $1"
echo "cloudformation validate-template --template-body file://sam.yml  --profile tcc-td-puc-minas-admin"
aws cloudformation validate-template --template-body file://sam.yml  --profile tcc-td-puc-minas-admin
