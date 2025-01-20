FileCopy("C:\*.au3", "D:\mydir\*.*")

; method to copy a folder (with its contents)
DirCreate("C:\new")
FileCopy("C:\old\*.*", "C:\new\")
