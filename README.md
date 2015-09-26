# Watch ... Then ...

I often need a simple file watcher that just checks for changes in a file then executes something and preferrably without having to write a complicated g(ulp|runt)file for the task, so i created this thing, just install it with NPM:

```
npm install -g watch-then-cli
```

Then use it to watch for changes.

```
watch filemask {more filemasks ...} then "command" {more commands to run...}
```




## Examples

Watching for source file changes, then running make then executing the application:

```
watch src/*.cpp include/*.h then "make compile && ./myprogram"
```

Watching for when a graphviz document changes and generate a png of it and then showing it:

```
watch myfile.gv then "graphviz myfile -Tpng myfile.gv myfile.png" "open myfile.png"
```

