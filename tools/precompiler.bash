#!/bin/bash
scriptsPath=$(pwd)
cd ..
componentPath=$(pwd)/js/components/

coreComponent="core"

cd $componentPath
ls -d */ | rev | cut -c 2- | rev | while read component; do
    if [ $component = $coreComponent ]; then
        continue
    fi
    cd $scriptsPath
    if [ -f /$component"JSscripts.txt" ]; then
        touch $component"JSscripts.txt"
    else
        echo -n >$component"JSscripts.txt"
    fi
    cd $componentPath
    cd ./$component
    ls -d */ | rev | cut -c 2- | rev | while read el; do
        cd ./$el
        handlebars $el.hbs -f $el.precompile.js
        cd ..
        echo "<script src=\"components/$component/$el/$el.precompile.js\"></script>" >>$scriptsPath/$component"JSscripts.txt"
    done
    cd ..
done

cd $scriptsPath
