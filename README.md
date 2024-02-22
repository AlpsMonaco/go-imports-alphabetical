# go-imports-alphabetical README

[中文](#Chinese)

This is an Visual Studio Code Extension organize your go imports in alphabetical. 

# Prerequisite

You may need to define the following JSON settings in either user.json or workspace.json.  
Accroding to issue: https://github.com/microsoft/vscode-go/issues/3059#issuecomment-589072036.  
But when you import a new package,gopls will still sort you imports by `goimports`.That's why you might need this extension.    


```json
    "[go]": {
        "editor.codeActionsOnSave": {
            "source.organizeImports": "never"
        },
        "editor.formatOnSave": false,
    },
```

## Usage
* use shortcut `Ctrl+Shift+P`
* select/type `Sort Go Imports In Alphabetical`


![usage gif](assets/usage.gif)

## Why

The offcial Go Extension with gopls currently uses `goimports` to sort imports and it doesn't provide any interface to change that.  
It is annoying when your Go project is maintained by both `vscode` and `goland` developers due to diffierent import sort strategies.  
Especially when you are going to submit you code...  


## Extension Settings

`goImportsAlphabetical.keepEmptyLine`  
`default:true`

Whether to keep empty line or not.  
If enabled,all imports will be separated by empty lines,grouped into each group,  
then sorted within groups while keeping the empty lines.


`goImportsAlphabetical.ignoreImportAlias`  
`default:true`

Choose whether to sort by import package aliases.If enabled,ignore imports aliases and then sort.

## Release Notes

### 0.0.1

organize go imports function works properly.

### 0.0.2

update readme.md with gif.

### 0.0.3

update Chinese documentation.

### 0.0.4

update extension settings.


## For more information

contact me at
[github.com/AlpsMonaco/go-imports-alphabetical](https://github.com/AlpsMonaco/go-imports-alphabetical)


**Enjoy!**

<a id="Chinese"></a>

这个插件帮助你把 go 的导入包按字母顺序排序

## 用法
* 使用快捷键 `Ctrl+Shift+P`
* 选择/输入 `Sort Go Imports In Alphabetical`


![usage gif](assets/usage.gif)

## 为什么要做这个插件

当前官方的go插件使用gopls语言服务器，只支持goimports，没办法修改。  
当你的go项目开发成员同时用`vscode` 和 `goland`的时候会很麻烦。  
尤其是提交代码的时候。。。  


## Extension Settings

there no any extension settings currently.

## Release Notes

### 0.0.1

测试核心功能工作正常

### 0.0.2

增加gif用例

### 0.0.3

添加中文文档


## For more information

在github上联系我:  
[github.com/AlpsMonaco/go-imports-alphabetical](https://github.com/AlpsMonaco/go-imports-alphabetical)


**Enjoy!**