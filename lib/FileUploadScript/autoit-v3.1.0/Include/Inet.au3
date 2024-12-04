#include-once

; ------------------------------------------------------------------------------
;
; AutoIt Version: 3.0
; Language:       English
; Description:    Functions that assist with Intenet.
;
; ------------------------------------------------------------------------------


;===============================================================================
;
; Function Name:    _GetIP()
; Description:      Get public IP address of a network/computer.
; Parameter(s):     None
; Requirement(s):   Internet access.
; Return Value(s):  On Success - Returns the public IP Address
;                   On Failure - -1  and sets @ERROR = 1
; Author(s):        Larry/Ezzetabi & Jarvis Stubblefield 
;
;===============================================================================

Func _GetIP()
	Local $ip
	If InetGet("http://www.whatismyip.com", @TempDir & "\~ip.tmp") Then
		$ip = FileRead(@TempDir & "\~ip.tmp", FileGetSize(@TempDir & "\~ip.tmp"))
		FileDelete(@TempDir & "\~ip.tmp")
		$ip = StringTrimLeft($ip, StringInStr($ip, "<TITLE>Your ip is ") + 17)
		$ip = StringLeft($ip, StringInStr($ip, " WhatIsMyIP.com</TITLE>") - 1)      
		Return $ip
	Else
		SetError(1)
		Return -1
	EndIf
EndFunc ;Function End >> _GetIP()

;===============================================================================
;
; Function Name:    _INetExplorerCapable()
; Description:      Convert a string to IE capable line
; Parameter(s):     $s_IEString - String to convert to a capable IExplorer line
; Requirement(s):   None
; Return Value(s):  On Success - Returns the converted string
;                   On Failure - Blank String and @error = 1
; Author(s):        Wes Wolfe-Wolvereness <Weswolf@aol.com>
;
;===============================================================================
;
Func _INetExplorerCapable($s_IEString)
	If StringLen($s_IEString) <= 0 Then
		Return ''
      SetError(1)
	Else
		Local $s_IEReturn
		Local $i_IECount
		Local $n_IEChar
		For $i_IECount = 1 To StringLen($s_IEString)
			$n_IEChar = '0x' & Hex(Asc(StringMid($s_IEString, $i_IECount, 1)), 2)
			If $n_IEChar < 0x21 Or $n_IEChar = 0x25 Or $n_IEChar = 0x2f Or $n_IEChar > 0x7f Then
				$s_IEReturn = $s_IEReturn & '%' & StringRight($n_IEChar, 2)
			Else
				$s_IEReturn = $s_IEReturn & Chr($n_IEChar)
			EndIf
		Next
		Return $s_IEReturn
	EndIf
EndFunc   ;==>_INetExplorerCapable

;===============================================================================
;
; Function Name:    _INetMail()
; Description:      Open default mail client with given Address/Subject/Body
; Parameter(s):     $s_MailTo    - Address for E-Mail 
;                   $s_Subject   - Subject <Weswolf@aol.com>of E-Mail
;                   $s_MailBody  - Body of E-Mail
; Requirement(s):   _INetExplorerCapable
; Return Value(s):  On Success - Process ID of e-mail client
;                   On Failure - If Opt('RunErrorsFatal', 1)
;                                   -> Crash
;                                Else Opt('RunErrorsFatal', 0)
;                                   -> Blank String and @error = 1
; Author(s):        Wes Wolfe-Wolvereness <Weswolf@aol.com>
;
;===============================================================================
;
Func _INetMail($s_MailTo, $s_MailSubject, $s_MailBody)
	Return Run(StringReplace(RegRead('HKCR\mailto\shell\open\command', ''), '%1', _INetExplorerCapable ('mailto:' & $s_MailTo & '?subject=' & $s_MailSubject & '&body=' & $s_MailBody))) = 0
EndFunc   ;==>_INetMail