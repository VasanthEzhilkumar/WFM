$destination = @TempDir & "\mySplash.bmp"
FileInstall("C:\foo.bmp", $destination)  ;source must be literal string

SplashImageOn("Splash Screen", $destination)
Sleep(3000)
SplashOff()
