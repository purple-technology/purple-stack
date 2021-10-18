rm -f -r .nyc_output
rm -f -r coverage
rm -f -r coverage-report

for filename in $(find . -name "coverage-final.json")
do
    FOLDER_NAME=$(basename $(dirname $(dirname $filename)))
    mkdir -p .nyc_output
    cp $filename .nyc_output/$FOLDER_NAME-$(basename $filename)
done

nyc merge .nyc_output ./coverage/coverage-final.json
nyc report -t coverage --report-dir coverage-report --reporter=html --reporter=cobertura --check-coverage
