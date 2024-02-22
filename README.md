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

### 0.0.5

update Chinese documentation.


## For more information

contact me at
[github.com/AlpsMonaco/go-imports-alphabetical](https://github.com/AlpsMonaco/go-imports-alphabetical)


**Enjoy!**

<a id="Chinese"></a>

这个插件帮助你把 go 的导入包按字母顺序排序

# 先决配置

你可能需要先定义以下的json设置在你的 user.json 或者 workspace.json 中  
来源issue: https://github.com/microsoft/vscode-go/issues/3059#issuecomment-589072036.  
但是当你导入新的包的时候，gopls还是会用goimports来排序你的导入包，这就是为啥你可能需要这个插件    


```json
    "[go]": {
        "editor.codeActionsOnSave": {
            "source.organizeImports": "never"
        },
        "editor.formatOnSave": false,
    },
```


## 用法
* 使用快捷键 `Ctrl+Shift+P`
* 选择/输入 `Sort Go Imports In Alphabetical`


![usage gif](assets/usage.gif)

## 为什么要做这个插件

当前官方的go插件使用gopls语言服务器，只支持goimports，没办法修改。  
当你的go项目开发成员同时用`vscode` 和 `goland`的时候会很麻烦。  
尤其是提交代码的时候。。。  


## 插件设置

`goImportsAlphabetical.keepEmptyLine`  
`default:true`

是否保留空行


`goImportsAlphabetical.ignoreImportAlias`  
`default:true`

包的别名是否参与排序

## Release Notes

### 0.0.1

测试核心功能工作正常

### 0.0.2

增加gif用例

### 0.0.3

添加中文文档

### 0.0.4

更新插件设置

### 0.0.5

更新中文文档


## For more information

在github上联系我:  
[github.com/AlpsMonaco/go-imports-alphabetical](https://github.com/AlpsMonaco/go-imports-alphabetical)


**Enjoy!**