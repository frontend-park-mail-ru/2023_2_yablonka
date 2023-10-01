#!/bin/bash
if [ -f /JSscripts.txt ]; then
    touch JSscripts.txt
else
    echo -n >JSscripts.txt
fi
scriptsText=""

scriptsPath=$(pwd)
cd ..
componentPath=$(pwd)/static/js/components/signComponents

componentClassName="componentClass"

cd $componentPath
ls -d */ | rev | cut -c 2- | rev | while read el; do
    if [ $el = $componentClassName ]; then
        continue
    fi
    cd ./$el
    handlebars $el.hbs -f $el.precompile.js
    cd ..
    echo "<script src=\"../js/components/signComponents/$el/$el.precompile.js\"></script>" >> $scriptsPath/JSscripts.txt
done

cd $scriptsPath
