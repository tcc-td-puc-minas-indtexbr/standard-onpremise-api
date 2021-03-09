echo "AWS Account: $1"
echo "sed -i \"s/\${AWS::AccountId}:role/$1:role/g\" packaged.yml"
sed -i "s/\${AWS::AccountId}:role/$1:role/g" packaged.yml

echo "cloudformation deploy --template-file packaged.yml --stack-name standard-onpremise-api-stack --region sa-east-1 --profile tcc-td-puc-minas-admin"
aws cloudformation deploy --template-file packaged.yml --stack-name standard-onpremise-api-stack --region sa-east-1 --profile tcc-td-puc-minas-admin
