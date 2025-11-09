# !/bin/sh

filename="htmlminify.html"
cat "$filename" | sed -e "s/\s{2,}|\n/''/g"


# $filename = `echo $filename//`

# readAsText(file);
# html = html.replace(/ {2,}|\n/g, '');
