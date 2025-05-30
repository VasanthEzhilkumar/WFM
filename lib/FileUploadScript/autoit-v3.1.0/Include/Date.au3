#include-once
; version 2004/12/11 - 4
; ------------------------------------------------------------------------------
;
; AutoIt Version: 3.0
; Language:       English
; Description:    Functions that assist with dates and times.
;
; ==============================================================================
; VERSION       DATE       DESCRIPTION
; -------    ----------    -----------------------------------------------------
; v1.0.00    01/21/2004    Initial release
; v1.0.01    02/05/2004    Fixed: _TicksToTime and _TimeToTicks
; v1.0.02    02/06/2004    Fixed: _TicksToTime
; v1.0.03    02/12/2004    Added: _DateAdd, _DateDiff, _DateToDayValue, _DayValueToDate
;                                 _DateTimeFormat, _DateToDayOfWeek, _DateIsValid
;                                 _DateTimeSplit, _Now(), _NowTime(), _NowDate(),_DateDaysInMonth()
;                                 _DateDayOfWeek(), Nowcalc()
; v1.0.04    12/11/2004    Updated: _DateAdd: change logic to make it faster.
; ------------------------------------------------------------------------------

;===============================================================================
;
; Description:      Calculates a new date based on a given date and add an interval.
; Parameter(s):     $sType    D = Add number of days to the given date
;                             M = Add number of months to the given date
;                             Y = Add number of years to the given date
;                             w = Add number of Weeks to the given date
;                             h = Add number of hours to the given date
;                             n = Add number of minutes to the given date
;                             s = Add number of seconds to the given date
;                   $iValToAdd - number to be added
;                   $sDate    - Input date in the format YYYY/MM/DD[ HH:MM:SS]
; Requirement(s):   None
; Return Value(s):  On Success - Date newly calculated date.
;                   On Failure - 0  and Set
;                                   @ERROR to:  1 - Invalid $sType
;                                                  2 - Invalid $iValToAdd
;                                                  3 - Invalid $sDate
; Author(s):        Jos van der Zande
; Note(s):          The function will not return an invalid date.
;                   When 3 months is are to '2004/1/31' then the result will be 2004/04/30
;
;
;===============================================================================
Func _DateAdd($sType, $iValToAdd, $sDate)
	Local $asTimePart[4]
	Local $asDatePart[4]
	Local $iJulianDate
	Local $iTimeVal
	Local $iNumDays
	Local $Y
	Local $Day2Add
	; Verify that $sType is Valid
	$sType = StringLeft($sType, 1)
	If StringInStr("D,M,Y,w,h,n,s", $sType) = 0 Or $sType = "" Then
		SetError(1)
		Return (0)
	EndIf
	; Verify that Value to Add  is Valid
	If Not StringIsInt($iValToAdd) Then
		SetError(2)
		Return (0)
	EndIf
	; Verify If InputDate is valid
	If Not _DateIsValid($sDate) Then
		SetError(3)
		Return (0)
	EndIf
	; split the date and time into arrays
	_DateTimeSplit($sDate, $asDatePart, $asTimePart)
	
	; ====================================================
	; adding days then get the julian date
	; add the number of day
	; and convert back to Gregorian
	If $sType = "d" Or $sType = "w" Then
		If $sType = "w" Then $iValToAdd = $iValToAdd * 7
		$iJulianDate = _DateToDayValue($asDatePart[1], $asDatePart[2], $asDatePart[3]) + $iValToAdd
		_DayValueToDate($iJulianDate, $asDatePart[1], $asDatePart[2], $asDatePart[3])
	EndIf
	; ====================================================
	; adding Months
	If $sType == "m" Then
		$asDatePart[2] = $asDatePart[2] + $iValToAdd
		; pos number of months
		While $asDatePart[2] > 12
			$asDatePart[2] = $asDatePart[2] - 12
			$asDatePart[1] = $asDatePart[1] + 1
		WEnd
		; Neg number of months
		While $asDatePart[2] < 1
			$asDatePart[2] = $asDatePart[2] + 12
			$asDatePart[1] = $asDatePart[1] - 1
		WEnd
	EndIf
	; ====================================================
	; adding Years
	If $sType = "y" Then
		$asDatePart[1] = $asDatePart[1] + $iValToAdd
	EndIf
	; ====================================================
	; adding Time value
	If $sType = "h" Or $sType = "n" Or $sType = "s" Then
		$iTimeVal = _TimeToTicks($asTimePart[1], $asTimePart[2], $asTimePart[3]) / 1000
		If $sType = "h" Then $iTimeVal = $iTimeVal + $iValToAdd * 3600
		If $sType = "n" Then $iTimeVal = $iTimeVal + $iValToAdd * 60
		If $sType = "s" Then $iTimeVal = $iTimeVal + $iValToAdd
		; calculated days to add
		$Day2Add = Int($iTimeVal/ (24 * 60 * 60))
		$iTimeVal = $iTimeVal - $Day2Add * 24 * 60 * 60
		If $iTimeVal < 0 Then
			$Day2Add = $Day2Add - 1
			$iTimeVal = $iTimeVal + 24 * 60 * 60
		EndIf
		$iJulianDate = _DateToDayValue($asDatePart[1], $asDatePart[2], $asDatePart[3]) + $Day2Add
		; calculate the julian back to date
		_DayValueToDate($iJulianDate, $asDatePart[1], $asDatePart[2], $asDatePart[3])
		; caluculate the new time
		_TicksToTime($iTimeVal * 1000, $asTimePart[1], $asTimePart[2], $asTimePart[3])
	EndIf
	; ====================================================
	; check if the Input day is Greater then the new month last day.
	; if so then change it to the last possible day in the month
	$iNumDays = StringSplit('31,28,31,30,31,30,31,31,30,31,30,31', ',')
	If _DateIsLeapYear($asDatePart[1]) Then $iNumDays[2] = 29
	;
	If $iNumDays[$asDatePart[2]] < $asDatePart[3] Then $asDatePart[3] = $iNumDays[$asDatePart[2]]
	; ========================
	; Format the return date
	; ========================
	; Format the return date
	$sDate = $asDatePart[1] & '/' & StringRight("0" & $asDatePart[2], 2) & '/' & StringRight("0" & $asDatePart[3], 2)
	; add the time when specified in the input
	If $asTimePart[0] > 0 Then
		If $asTimePart[0] > 2 Then
			$sDate = $sDate & " " & StringRight("0" & $asTimePart[1], 2) & ':' & StringRight("0" & $asTimePart[2], 2) & ':' & StringRight("0" & $asTimePart[3], 2)
		Else
			$sDate = $sDate & " " & StringRight("0" & $asTimePart[1], 2) & ':' & StringRight("0" & $asTimePart[2], 2)
		EndIf
	EndIf
	;
	return ($sDate)
EndFunc   ;==>_DateAdd

;===============================================================================
;
; Description:      Returns the name of the weekday, based on the specified day.
; Parameter(s):     $iDayNum - Day number
;                   $iShort  - Format:
;                              0 = Long name of the weekday
;                              1 = Abbreviated name of the weekday
; Requirement(s):   None
; Return Value(s):  On Success - Weekday name
;                   On Failure - A NULL string and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          English only
;
;===============================================================================
Func _DateDayOfWeek($iDayNum, $iShort = 0)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $aDayOfWeek[8]
	
	$aDayOfWeek[1] = "Sunday"
	$aDayOfWeek[2] = "Monday"
	$aDayOfWeek[3] = "Tuesday"
	$aDayOfWeek[4] = "Wednesday"
	$aDayOfWeek[5] = "Thursday"
	$aDayOfWeek[6] = "Friday"
	$aDayOfWeek[7] = "Saturday"
	Select
		Case Not StringIsInt($iDayNum) Or Not StringIsInt($iShort)
			SetError(1)
			Return ""
		Case $iDayNum < 1 Or $iDayNum > 7
			SetError(1)
			Return ""
		Case Else
			Select
				Case $iShort = 0
					Return $aDayOfWeek[$iDayNum]
				Case $iShort = 1
					Return StringLeft($aDayOfWeek[$iDayNum], 3)
				Case Else
					SetError(1)
					Return ""
			EndSelect
	EndSelect
EndFunc   ;==>_DateDayOfWeek

;===============================================================================
;
; Function Name:  _DateDaysInMonth()
; Description:    Returns the number of days in a month, based on the specified
;                 month and year.
; Author(s):      Jeremy Landes <jlandes@landeserve.com>
;
;===============================================================================
Func _DateDaysInMonth($iYear, $iMonthNum)
	Local $aiNumDays
	
	$aiNumDays = "31,28,31,30,31,30,31,31,30,31,30,31"
	$aiNumDays = StringSplit($aiNumDays, ",")
	
	If _DateIsMonth($iMonthNum) And _DateIsYear($iYear) Then
		If _DateIsLeapYear($iYear) Then $aiNumDays[2] = $aiNumDays[2] + 1
		SetError(0)
		Return $aiNumDays[$iMonthNum]
	Else
		SetError(1)
		Return 0
	EndIf
EndFunc   ;==>_DateToDaysInMonth

;===============================================================================
;
; Description:      Returns the difference between 2 dates, expressed in the type requested
; Parameter(s):     $sType - returns the difference in:
;                               d = days
;                               m = Months
;                               y = Years
;                               w = Weeks
;                               h = Hours
;                               n = Minutes
;                               s = Seconds
;                   $sStartDate    - Input Start date in the format "YYYY/MM/DD[ HH:MM:SS]"
;                   $sEndDate    - Input End date in the format "YYYY/MM/DD[ HH:MM:SS]"
; Requirement(s):   None
; Return Value(s):  On Success - Difference between the 2 dates
;                   On Failure - 0  and Set
;                                   @ERROR to:  1 - Invalid $sType
;                                               2 - Invalid $sStartDate
;                                               3 - Invalid $sEndDate
; Author(s):        Jos van der Zande
; Note(s):
;
;===============================================================================
Func _DateDiff($sType, $sStartDate, $sEndDate)
	Local $asStartDatePart[4]
	Local $asStartTimePart[4]
	Local $asEndDatePart[4]
	Local $asEndTimePart[4]
	Local $iTimeDiff
	Local $iYearDiff
	Local $iMonthDiff
	Local $iStartTimeInSecs
	Local $iEndTimeInSecs
	Local $aDaysDiff
	;
	; Verify that $sType is Valid
	$sType = StringLeft($sType, 1)
	If StringInStr("d,m,y,w,h,n,s", $sType) = 0 Or $sType = "" Then
		SetError(1)
		Return (0)
	EndIf
	; Verify If StartDate is valid
	If Not _DateIsValid($sStartDate) Then
		SetError(2)
		Return (0)
	EndIf
	; Verify If EndDate is valid
	If Not _DateIsValid($sEndDate) Then
		SetError(3)
		Return (0)
	EndIf
	; split the StartDate and Time into arrays
	_DateTimeSplit($sStartDate, $asStartDatePart, $asStartTimePart)
	; split the End  Date and time into arrays
	_DateTimeSplit($sEndDate, $asEndDatePart, $asEndTimePart)
	; ====================================================
	; Get the differens in days between the 2 dates
	$aDaysDiff = _DateToDayValue($asEndDatePart[1], $asEndDatePart[2], $asEndDatePart[3]) - _DateToDayValue($asStartDatePart[1], $asStartDatePart[2], $asStartDatePart[3])
	; ====================================================
	; Get the differens in Seconds between the 2 times when specified
	If $asStartTimePart[0] > 1 And $asEndTimePart[0] > 1 Then
		$iStartTimeInSecs = $asStartTimePart[1] * 3600 + $asStartTimePart[2] * 60 + $asStartTimePart[3]
		$iEndTimeInSecs = $asEndTimePart[1] * 3600 + $asEndTimePart[2] * 60 + $asEndTimePart[3]
		$iTimeDiff = $iEndTimeInSecs - $iStartTimeInSecs
		If $iTimeDiff < 0 Then
			$aDaysDiff = $aDaysDiff - 1
			$iTimeDiff = $iTimeDiff + 24 * 60 * 60
		EndIf
	Else
		$iTimeDiff = 0
	EndIf
	Select
		Case $sType = "d"
			Return ($aDaysDiff)
		Case $sType = "m"
			$iYearDiff = $asEndDatePart[1] - $asStartDatePart[1]
			$iMonthDiff = $asEndDatePart[2] - $asStartDatePart[2] + $iYearDiff * 12
			If $asEndDatePart[3] < $asStartDatePart[3] Then $iMonthDiff = $iMonthDiff - 1
			$iStartTimeInSecs = $asStartTimePart[1] * 3600 + $asStartTimePart[2] * 60 + $asStartTimePart[3]
			$iEndTimeInSecs = $asEndTimePart[1] * 3600 + $asEndTimePart[2] * 60 + $asEndTimePart[3]
			$iTimeDiff = $iEndTimeInSecs - $iStartTimeInSecs
			If $asEndDatePart[3] = $asStartDatePart[3] And $iTimeDiff < 0 Then $iMonthDiff = $iMonthDiff - 1
			Return ($iMonthDiff)
		Case $sType = "y"
			$iYearDiff = $asEndDatePart[1] - $asStartDatePart[1]
			If $asEndDatePart[2] < $asStartDatePart[2] Then $iYearDiff = $iYearDiff - 1
			If $asEndDatePart[2] = $asStartDatePart[2] And $asEndDatePart[3] < $asStartDatePart[3] Then $iYearDiff = $iYearDiff - 1
			$iStartTimeInSecs = $asStartTimePart[1] * 3600 + $asStartTimePart[2] * 60 + $asStartTimePart[3]
			$iEndTimeInSecs = $asEndTimePart[1] * 3600 + $asEndTimePart[2] * 60 + $asEndTimePart[3]
			$iTimeDiff = $iEndTimeInSecs - $iStartTimeInSecs
			If $asEndDatePart[2] = $asStartDatePart[2] And $asEndDatePart[3] = $asStartDatePart[3] And $iTimeDiff < 0 Then $iYearDiff = $iYearDiff - 1
			Return ($iYearDiff)
		Case $sType = "w"
			Return (Int($aDaysDiff / 7))
		Case $sType = "h"
			Return ($aDaysDiff * 24 + Int($iTimeDiff / 3600))
		Case $sType = "n"
			Return ($aDaysDiff * 24 * 60 + Int($iTimeDiff / 60))
		Case $sType = "s"
			Return ($aDaysDiff * 24 * 60 * 60 + $iTimeDiff)
	EndSelect
EndFunc   ;==>_DateDiff

;===============================================================================
;
; Description:      Returns 1 if the specified year falls on a leap year and
;                   returns 0 if it does not.
; Parameter(s):     $iYear - Year to check
; Requirement(s):   None
; Return Value(s):  On Success - 0 = Year is not a leap year
;                                1 = Year is a leap year
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateIsLeapYear($iYear)
	If StringIsInt($iYear) Then
		Select
			Case Mod($iYear, 4) = 0 And Mod($iYear, 100) <> 0
				Return 1
			Case Mod($iYear, 400) = 0
				Return 1
			Case Else
				Return 0
		EndSelect
	Else
		SetError(1)
		Return 0
	EndIf
EndFunc   ;==>_DateIsLeapYear

;===============================================================================
;
; Function Name:  _DateIsMonth()
; Description:    Checks a given number to see if it is a valid month.
; Author(s):      Jeremy Landes <jlandes@landeserve.com>
;
;===============================================================================
Func _DateIsMonth($iNumber)
	If StringIsInt($iNumber) Then
		If $iNumber >= 1 And $iNumber <= 12 Then
			Return 1
		Else
			Return 0
		EndIf
	Else
		Return 0
	EndIf
EndFunc   ;==>_DateIsMonth

;===============================================================================
;
; Description:      Verify if date and time are valid "yyyy/mm/dd[ hh:mm[:ss]]".
; Parameter(s):     $sDate format "yyyy/mm/dd[ hh:mm[:ss]]"
; Requirement(s):   None
; Return Value(s):  On Success - 1
;                   On Failure - 0
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
;                   Jos van der Zande <jdeb@autoitscript.com>
; Note(s):          None
;
;===============================================================================
Func _DateIsValid($sDate)
	Local $asDatePart[4]
	Local $asTimePart[4]
	Local $iNumDays
	
	$iNumDays = "31,28,31,30,31,30,31,31,30,31,30,31"
	$iNumDays = StringSplit($iNumDays, ",")
	; split the date and time into arrays
	_DateTimeSplit($sDate, $asDatePart, $asTimePart)
	
	If $asDatePart[0] <> 3 Then
		Return (0)
	EndIf
	; verify valid input date values
	If _DateIsLeapYear($asDatePart[1]) Then $iNumDays[2] = 29
	If $asDatePart[1] < 1900 Or $asDatePart[1] > 2999 Then Return (0)
	If $asDatePart[2] < 1 Or $asDatePart[2] > 12 Then Return (0)
	If $asDatePart[3] < 1 Or $asDatePart[3] > $iNumDays[$asDatePart[2]] Then Return (0)
	
	; verify valid input Time values
	If $asTimePart[0] < 1 Then Return (1)    ; No time specified so date must be correct
	If $asTimePart[0] < 3 Then Return (0)    ; need at least HH:MM when something is specified
	If $asTimePart[1] < 0 Or $asTimePart[1] > 23 Then Return (0)
	If $asTimePart[2] < 0 Or $asTimePart[2] > 59 Then Return (0)
	If $asTimePart[3] < 0 Or $asTimePart[3] > 59 Then Return (0)
	; we got here so date/time must be good
	Return (1)
EndFunc   ;==>_DateIsValid

;===============================================================================
;
; Function Name:  _DateIsYear()
; Description:    Checks a given number to see if it is a valid year.
; Author(s):      Jeremy Landes <jlandes@landeserve.com>
;
;===============================================================================
Func _DateIsYear($iNumber)
	If StringIsInt($iNumber) Then
		If StringLen($iNumber) = 4 Then
			Return 1
		Else
			Return 0
		EndIf
	Else
		Return 0
	EndIf
EndFunc   ;==>_DateIsYear

;===============================================================================
;
; Description:      Returns previous weekday number, based on the specified day
;                   of the week.
; Parameter(s):     $iWeekdayNum - Weekday number
; Requirement(s):   None
; Return Value(s):  On Success - Previous weekday number
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateLastWeekdayNum($iWeekdayNum)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iLastWeekdayNum
	
	Select
		Case Not StringIsInt($iWeekdayNum)
			SetError(1)
			Return 0
		Case $iWeekdayNum < 1 Or $iWeekdayNum > 7
			SetError(1)
			Return 0
		Case Else
			If $iWeekdayNum = 1 Then
				$iLastWeekdayNum = 7
			Else
				$iLastWeekdayNum = $iWeekdayNum - 1
			EndIf
			
			Return $iLastWeekdayNum
	EndSelect
EndFunc   ;==>_DateLastWeekdayNum

;===============================================================================
;
; Description:      Returns previous month number, based on the specified month.
; Parameter(s):     $iMonthNum - Month number
; Requirement(s):   None
; Return Value(s):  On Success - Previous month number
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateLastMonthNum($iMonthNum)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iLastMonthNum
	
	Select
		Case Not StringIsInt($iMonthNum)
			SetError(1)
			Return 0
		Case $iMonthNum < 1 Or $iMonthNum > 12
			SetError(1)
			Return 0
		Case Else
			If $iMonthNum = 1 Then
				$iLastMonthNum = 12
			Else
				$iLastMonthNum = $iMonthNum - 1
			EndIf
			
			$iLastMonthNum = StringFormat( "%02d", $iLastMonthNum)
			Return $iLastMonthNum
	EndSelect
EndFunc   ;==>_DateLastMonthNum

;===============================================================================
;
; Description:      Returns previous month's year, based on the specified month
;                   and year.
; Parameter(s):     $iMonthNum - Month number
;                   $iYear     - Year
; Requirement(s):   None
; Return Value(s):  On Success - Previous month's year
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateLastMonthYear($iMonthNum, $iYear)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iLastYear
	
	Select
		Case Not StringIsInt($iMonthNum) Or Not StringIsInt($iYear)
			SetError(1)
			Return 0
		Case $iMonthNum < 1 Or $iMonthNum > 12
			SetError(1)
			Return 0
		Case Else
			If $iMonthNum = 1 Then
				$iLastYear = $iYear - 1
			Else
				$iLastYear = $iYear
			EndIf
			
			$iLastYear = StringFormat( "%04d", $iLastYear)
			Return $iLastYear
	EndSelect
EndFunc   ;==>_DateLastMonthYear

;===============================================================================
;
; Description:      Returns the name of the month, based on the specified month.
; Parameter(s):     $iMonthNum - Month number
;                   $iShort    - Format:
;                                0 = Long name of the month
;                                1 = Abbreviated name of the month
; Requirement(s):   None
; Return Value(s):  On Success - Month name
;                   On Failure - A NULL string and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          English only
;
;===============================================================================
Func _DateMonthOfYear($iMonthNum, $iShort)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $aMonthOfYear[13]
	
	$aMonthOfYear[1] = "January"
	$aMonthOfYear[2] = "February"
	$aMonthOfYear[3] = "March"
	$aMonthOfYear[4] = "April"
	$aMonthOfYear[5] = "May"
	$aMonthOfYear[6] = "June"
	$aMonthOfYear[7] = "July"
	$aMonthOfYear[8] = "August"
	$aMonthOfYear[9] = "September"
	$aMonthOfYear[10] = "October"
	$aMonthOfYear[11] = "November"
	$aMonthOfYear[12] = "December"
	
	Select
		Case Not StringIsInt($iMonthNum) Or Not StringIsInt($iShort)
			SetError(1)
			Return ""
		Case $iMonthNum < 1 Or $iMonthNum > 12
			SetError(1)
			Return ""
		Case Else
			Select
				Case $iShort = 0
					Return $aMonthOfYear[$iMonthNum]
				Case $iShort = 1
					Return StringLeft($aMonthOfYear[$iMonthNum], 3)
				Case Else
					SetError(1)
					Return ""
			EndSelect
	EndSelect
EndFunc   ;==>_DateMonthOfYear

;===============================================================================
;
; Description:      Returns next weekday number, based on the specified day of
;                   the week.
; Parameter(s):     $iWeekdayNum - Weekday number
; Requirement(s):   None
; Return Value(s):  On Success - Next weekday number
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateNextWeekdayNum($iWeekdayNum)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iNextWeekdayNum
	
	Select
		Case Not StringIsInt($iWeekdayNum)
			SetError(1)
			Return 0
		Case $iWeekdayNum < 1 Or $iWeekdayNum > 7
			SetError(1)
			Return 0
		Case Else
			If $iWeekdayNum = 7 Then
				$iNextWeekdayNum = 1
			Else
				$iNextWeekdayNum = $iWeekdayNum + 1
			EndIf
			
			Return $iNextWeekdayNum
	EndSelect
EndFunc   ;==>_DateNextWeekdayNum

;===============================================================================
;
; Description:      Returns next month number, based on the specified month.
; Parameter(s):     $iMonthNum - Month number
; Requirement(s):   None
; Return Value(s):  On Success - Next month number
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateNextMonthNum($iMonthNum)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iNextMonthNum
	
	Select
		Case Not StringIsInt($iMonthNum)
			SetError(1)
			Return 0
		Case $iMonthNum < 1 Or $iMonthNum > 12
			SetError(1)
			Return 0
		Case Else
			If $iMonthNum = 12 Then
				$iNextMonthNum = 1
			Else
				$iNextMonthNum = $iMonthNum + 1
			EndIf
			
			$iNextMonthNum = StringFormat( "%02d", $iNextMonthNum)
			Return $iNextMonthNum
	EndSelect
EndFunc   ;==>_DateNextMonthNum

;===============================================================================
;
; Description:      Returns next month's year, based on the specified month and
;                   year.
; Parameter(s):     $iMonthNum - Month number
;                   $iYear     - Year
; Requirement(s):   None
; Return Value(s):  On Success - Next month's year
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jeremy Landes <jlandes@landeserve.com>
; Note(s):          None
;
;===============================================================================
Func _DateNextMonthYear($iMonthNum, $iYear)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iNextYear
	
	Select
		Case Not StringIsInt($iMonthNum) Or Not StringIsInt($iYear)
			SetError(1)
			Return 0
		Case $iMonthNum < 1 Or $iMonthNum > 12
			SetError(1)
			Return 0
		Case Else
			If $iMonthNum = 12 Then
				$iNextYear = $iYear + 1
			Else
				$iNextYear = $iYear
			EndIf
			
			$iNextYear = StringFormat( "%04d", $iNextYear)
			Return $iNextYear
	EndSelect
EndFunc   ;==>_DateNextMonthYear

;===============================================================================
;
; Description:      Split Date and Time into two separateArrays.
; Parameter(s):     $sDate format "yyyy/mm/dd[ hh:mm[:ss]]"
;                    or    format "yyyy/mm/dd[Thh:mm[:ss]]"
;                    or    format "yyyy-mm-dd[ hh:mm[:ss]]"
;                    or    format "yyyy-mm-dd[Thh:mm[:ss]]"
;                    or    format "yyyy.mm.dd[ hh:mm[:ss]]"
;                    or    format "yyyy.mm.dd[Thh:mm[:ss]]"
;                   $asDatePart[4] array that contains the Date
;                   $iTimePart[4] array that contains the Time
; Requirement(s):   None
; Return Value(s):  Always 1
; Author(s):        Jos van der Zande
; Note(s):          Its expected you first do a _DateIsValid( $sDate ) for the input
;
;===============================================================================
Func _DateTimeSplit($sDate, ByRef $asDatePart, ByRef $iTimePart)
	Local $nMM
	Local $nDD
	Local $nYYYY
	Local $sDateTime
	; split the Date and Time portion
	$sDateTime = StringSplit($sDate, " T")
	; split the date portion
	If $sDateTime[0] > 0 Then $asDatePart = StringSplit($sDateTime[1], "/-.")
	; split the Time portion
	If $sDateTime[0] > 1 Then
		; Add the secconf 00 if not in the input
		If StringLen($sDateTime[2]) < 8 Then $sDateTime[2] = $sDateTime[2] & ":00"
		$iTimePart = StringSplit($sDateTime[2], ":")
	EndIf
	Return (1)
EndFunc   ;==>_DateTimeSplit

;===============================================================================
;
; Description:      Returns the number of days since noon 4713 BC January 1.
; Parameter(s):     $Year  - Year in format YYYY
;                   $Month - Month in format MM
;                   $sDate - Day of the month format DD
; Requirement(s):   None
; Return Value(s):  On Success - Returns the Juliandate
;                   On Failure - 0  and sets @ERROR = 1
; Author(s):        Jos van der Zande / Jeremy Landes
; Note(s):          None
;
;===============================================================================
Func _DateToDayValue($iYear, $iMonth, $iDay)
	Local $i_aFactor
	Local $i_bFactor
	Local $i_cFactor
	Local $i_dFactor
	Local $i_eFactor
	Local $i_fFactor
	Local $asDatePart[4]
	Local $iJulianDate
	; Verify If InputDate is valid
	If Not _DateIsValid(StringFormat( "%04d/%02d/%02d", $iYear, $iMonth, $iDay)) Then
		SetError(1)
		Return ("")
	EndIf
	If $iMonth < 3 Then
		$iMonth = $iMonth + 12
		$iYear = $iYear - 1
	EndIf
	$i_aFactor = Int($iYear / 100)
	$i_bFactor = Int($i_aFactor / 4)
	$i_cFactor = 2 - $i_aFactor + $i_bFactor
	$i_eFactor = Int(1461 * ($iYear + 4716) / 4)
	$i_fFactor = Int(153 * ($iMonth + 1) / 5)
	$iJulianDate = $i_cFactor + $iDay + $i_eFactor + $i_fFactor - 1524.5
	return ($iJulianDate)
EndFunc   ;==>_DateToDayValue

;===============================================================================
;
; Description:      Returns the DayofWeek number for a given Date.  1=Sunday
; Parameter(s):     $Year
;                   $Month
;                   $day
; Requirement(s):   None
; Return Value(s):  On Success - Returns Day of the Week Range is 1 to 7 where 1=Sunday.
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jos van der Zande <jdeb@autoitscript.com>
; Note(s):          None
;
;===============================================================================
Func _DateToDayOfWeek($iYear, $iMonth, $iDay)
	Local $asDatePart[4]
	Local $i_aFactor
	Local $i_yFactor
	Local $i_mFactor
	Local $i_dFactor
	; Verify If InputDate is valid
	If Not _DateIsValid($iYear & "/" & $iMonth & "/" & $iDay) Then
		SetError(1)
		Return ("")
	EndIf
	$i_aFactor = Int( (14 - $iMonth) / 12)
	$i_yFactor = $iYear - $i_aFactor
	$i_mFactor = $iMonth + (12 * $i_aFactor) - 2
	$i_dFactor = Mod($iDay + $i_yFactor + Int($i_yFactor / 4) - Int($i_yFactor / 100) + Int($i_yFactor / 400) + Int( (31 * $i_mFactor) / 12), 7)
	return ($i_dFactor + 1)
EndFunc   ;==>_DateToDayOfWeek

;===============================================================================
;
; Description:      Add the given days since noon 4713 BC January 1 and return the date.
; Parameter(s):     $iJulianDate    - Julian date number
;                   $Year  - Year in format YYYY
;                   $Month - Month in format MM
;                   $sDate - Day of the month format DD
; Requirement(s):   None
; Return Value(s):  On Success - Returns the Date in the parameter vars
;                   On Failure - 0  and sets @ERROR = 1
; Author(s):        Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _DayValueToDate($iJulianDate, ByRef $iYear, ByRef $iMonth, ByRef $iDay)
	Local $i_zFactor
	Local $i_wFactor
	Local $i_aFactor
	Local $i_bFactor
	Local $i_xFactor
	Local $i_cFactor
	Local $i_dFactor
	Local $i_eFactor
	Local $i_fFactor
	; check for valid input date
	If $iJulianDate < 0 Or Not IsNumber($iJulianDate) Then
		SetError(1)
		Return 0
	EndIf
	; calculte the date
	$i_zFactor = Int($iJulianDate + 0.5)
	$i_wFactor = Int( ($i_zFactor - 1867216.25) / 36524.25)
	$i_xFactor = Int($i_wFactor / 4)
	$i_aFactor = $i_zFactor + 1 + $i_wFactor - $i_xFactor
	$i_bFactor = $i_aFactor + 1524
	$i_cFactor = Int( ($i_bFactor - 122.1) / 365.25)
	$i_dFactor = Int(365.25 * $i_cFactor)
	$i_eFactor = Int( ($i_bFactor - $i_dFactor) / 30.6001)
	$i_fFactor = Int(30.6001 * $i_eFactor)
	$iDay = $i_bFactor - $i_dFactor - $i_fFactor
	; (must get number less than or equal to 12)
	If $i_eFactor - 1 < 13 Then
		$iMonth = $i_eFactor - 1
	Else
		$iMonth = $i_eFactor - 13
	EndIf
	If $iMonth < 3 Then
		$iYear = $i_cFactor - 4715    ; (if Month is January or February)
	Else
		$iYear = $i_cFactor - 4716    ;(otherwise)
	EndIf
	Return $iYear & "/" & $iMonth & "/" & $iDay
EndFunc   ;==>_DayValueToDate

;===============================================================================
;
; Description:      Returns the date in the PC's regional settings format.
; Parameter(s):     $date - format "YYYY/MM/DD"
;                   $sType - :
;                      0 - Display a date and/or time. If there is a date part, display it as a short date.
;                          If there is a time part, display it as a long time. If present, both parts are displayed.
;                      1 - Display a date using the long date format specified in your computer's regional settings.
;                      2 - Display a date using the short date format specified in your computer's regional settings.
;                      3 - Display a time using the time format specified in your computer's regional settings.
;                      4 - Display a time using the 24-hour format (hh:mm).
; Requirement(s):   None
; Return Value(s):  On Success - Returns date in proper format
;                   On Failure - 0  and Set
;                                   @ERROR to:  1 - Invalid $sDate
;                                               2 - Invalid $sType
; Author(s):        Jos van der Zande <jdeb@autoitscript.com>
; Note(s):          None...
;
;===============================================================================
Func _DateTimeFormat($sDate, $sType)
	Local $asDatePart[4]
	Local $asTimePart[4]
	Local $sReg_DateValue = ""
	Local $sReg_TimeValue = ""
	Local $sTempDate
	Local $sNewTime
	Local $sNewDate
	Local $sAM
	Local $sPM
	Local $iWday
	; Verify If InputDate is valid
	If Not _DateIsValid($sDate) Then
		SetError(1)
		Return ("")
	EndIf
	; input validation
	If $sType < 0 Or $sType > 4 Or Not IsInt($sType) Then
		SetError(2)
		Return ("")
	EndIf
	; split the date and time into arrays
	_DateTimeSplit($sDate, $asDatePart, $asTimePart)
	
	If $sType = 0 Then
		$sReg_DateValue = "sShortDate"
		If $asTimePart[0] > 1 Then $sReg_TimeValue = "sTimeFormat"
	EndIf
	
	If $sType = 1 Then $sReg_DateValue = "sLongDate"
	If $sType = 2 Then $sReg_DateValue = "sShortDate"
	If $sType = 3 Then $sReg_TimeValue = "sTimeFormat"
	If $sType = 4 Then $sReg_TimeValue = "sTime"
	$sNewDate = ""
	If $sReg_DateValue <> "" Then
		$sTempDate = RegRead("HKEY_CURRENT_USER\Control Panel\International", $sReg_DateValue)
		$sAM = RegRead("HKEY_CURRENT_USER\Control Panel\International", "s1159")
		$sPM = RegRead("HKEY_CURRENT_USER\Control Panel\International", "s2359")
		If $sAM = "" Then $sAM = "AM"
		If $sPM = "" Then $sPM = "PM"
		$iWday = _DateToDayOfWeek($asDatePart[1], $asDatePart[2], $asDatePart[3])
		$asDatePart[3] = StringRight("0" & $asDatePart[3], 2) ; make sure the length is 2
		$asDatePart[2] = StringRight("0" & $asDatePart[2], 2) ; make sure the length is 2
		$sTempDate = StringReplace($sTempDate, "d", "@")
		$sTempDate = StringReplace($sTempDate, "m", "#")
		$sTempDate = StringReplace($sTempDate, "y", "&")
		$sTempDate = StringReplace($sTempDate, "@@@@", _DateDayOfWeek($iWday, 0))
		$sTempDate = StringReplace($sTempDate, "@@@", _DateDayOfWeek($iWday, 1))
		$sTempDate = StringReplace($sTempDate, "@@", $asDatePart[3])
		$sTempDate = StringReplace($sTempDate, "@", StringReplace(StringLeft($asDatePart[3], 1), "0", "") & StringRight($asDatePart[3], 1))
		$sTempDate = StringReplace($sTempDate, "####", _DateMonthOfYear($asDatePart[2], 0))
		$sTempDate = StringReplace($sTempDate, "###", _DateMonthOfYear($asDatePart[2], 1))
		$sTempDate = StringReplace($sTempDate, "##", $asDatePart[2])
		$sTempDate = StringReplace($sTempDate, "#", StringReplace(StringLeft($asDatePart[2], 1), "0", "") & StringRight($asDatePart[2], 1))
		$sTempDate = StringReplace($sTempDate, "&&&&", $asDatePart[1])
		$sTempDate = StringReplace($sTempDate, "&&", StringRight($asDatePart[1], 2))
		$sNewDate = $sTempDate
	EndIf
	If $sReg_TimeValue <> "" Then
		$sNewTime = RegRead("HKEY_CURRENT_USER\Control Panel\International", $sReg_TimeValue)
		If $sType = 4 Then
			$sNewTime = $asTimePart[1] & $sNewTime & $asTimePart[2]
		Else
			If $asTimePart[1] < 12 Then
				$sNewTime = StringReplace($sNewTime, "tt", "AM")
				If $asTimePart[1] = 0 Then $asTimePart[1] = 12
			Else
				$sNewTime = StringReplace($sNewTime, "tt", "PM")
				If $asTimePart[1] > 12 Then $asTimePart[1] = $asTimePart[1] - 12
			EndIf
			$asTimePart[1] = StringRight("0" & $asTimePart[1], 2) ; make sure the length is 2
			$asTimePart[2] = StringRight("0" & $asTimePart[2], 2) ; make sure the length is 2
			$asTimePart[3] = StringRight("0" & $asTimePart[3], 2) ; make sure the length is 2
			$sNewTime = StringReplace($sNewTime, "hh", $asTimePart[1])
			$sNewTime = StringReplace($sNewTime, "h", StringReplace(StringLeft($asTimePart[1], 1), "0", "") & StringRight($asTimePart[1], 1))
			$sNewTime = StringReplace($sNewTime, "mm", $asTimePart[2])
			$sNewTime = StringReplace($sNewTime, "ss", $asTimePart[3])
		EndIf
		$sNewDate = StringStripWS($sNewDate & " " & $sNewTime, 3)
	EndIf
	Return ($sNewDate)
EndFunc   ;==>_DateTimeFormat

;===============================================================================
;
; Description:      Returns the the julian date in format YYDDD
; Parameter(s):     $iJulianDate    - Julian date number
;                   $Year  - Year in format YYYY
;                   $Month - Month in format MM
;                   $sDate - Day of the month format DD
; Requirement(s):   None
; Return Value(s):  On Success - Returns the Date in the parameter vars
;                   On Failure - 0  and sets @ERROR = 1
; Author(s):        Jeremy Landes / Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _DateJulianDayNo($iYear, $iMonth, $iDay)
	Local $sFullDate
	Local $aiDaysInMonth
	Local $iJDay
	Local $iCntr
	; Verify If InputDate is valid
	$sFullDate = StringFormat( "%04d/%02d/%02d", $iYear, $iMonth, $iDay)
	If Not _DateIsValid($sFullDate) Then
		SetError(1)
		Return ""
	EndIf
	; Build JDay value
	$iJDay = 0
	$aiDaysInMonth = __DaysInMonth($iYear)
	For $iCntr = 1 To $iMonth - 1
		$iJDay = $iJDay + $aiDaysInMonth[$iCntr]
	Next
	$iJDay = ($iYear * 1000) + ($iJDay + $iDay)
	Return $iJDay
EndFunc   ;==>_DateJulianDayNo

;===============================================================================
;
; Description:      Returns the date for a julian date in format YYDDD
; Parameter(s):     $iJDate  - Julian date number
; Requirement(s):   None
; Return Value(s):  On Success - Returns the Date in format YYYY/MM/DD
;                   On Failure - 0  and sets @ERROR = 1
; Author(s):        Jeremy Landes / Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _JulianToDate($iJDay)
	Local $aiDaysInMonth
	Local $iYear
	Local $iMonth
	Local $iDay
	Local $iDays
	Local $iMaxDays
	Local $sSep = "/"
	; Verify If InputDate is valid
	$iYear = Int($iJDay / 1000)
	$iDays = Mod($iJDay, 1000)
	$iMaxDays = 365
	If _DateIsLeapYear($iYear) Then $iMaxDays = 366
	If $iDays > $iMaxDays Then
		SetError(1)
		Return ""
	EndIf
	; Convert to regular date
	$aiDaysInMonth = __DaysInMonth($iYear)
	$iMonth = 1
	While $iDays > $aiDaysInMonth[ $iMonth ]
		$iDays = $iDays - $aiDaysInMonth[ $iMonth ]
		$iMonth = $iMonth + 1
	WEnd
	$iDay = $iDays
	Return StringFormat( "%04d%s%02d%s%02d", $iYear, $sSep, $iMonth, $sSep, $iDay)
EndFunc   ;==>_JulianToDate

;===============================================================================
;
; Description:      Returns the current Date and Time in the pc's format
; Parameter(s):     None
; Requirement(s):   None
; Return Value(s):  On Success - Date in pc's format
; Author(s):        Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _Now()
	Return (_DateTimeFormat(@YEAR & "/" & @MON & "/" & @MDAY & " " & @HOUR & ":" & @MIN & ":" & @SEC, 0))
EndFunc   ;==>_Now

;===============================================================================
;
; Description:      Returns the current Date and Time in format YYYY/MM/DD HH:MM:SS
; Parameter(s):     None
; Requirement(s):   None
; Return Value(s):  On Success - Date in in format YYYY/MM/DD HH:MM:SS
; Author(s):        Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _NowCalc()
	Return (@YEAR & "/" & @MON & "/" & @MDAY & " " & @HOUR & ":" & @MIN & ":" & @SEC)
EndFunc   ;==>_NowCalc
;===============================================================================
;
; Description:      Returns the current Date in format YYYY/MM/DD
; Parameter(s):     None
; Requirement(s):   None
; Return Value(s):  On Success - Date in in format YYYY/MM/DD
; Author(s):        Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _NowCalcDate()
	Return (@YEAR & "/" & @MON & "/" & @MDAY)
EndFunc   ;==>_NowCalcDate

;===============================================================================
;
; Description:      Returns the current Date in the pc's format
; Parameter(s):     None
; Requirement(s):   None
; Return Value(s):  On Success - Date in pc's format
; Author(s):        Jos van der Zande (Larry's idea)
; Note(s):          None
;
;===============================================================================
Func _NowDate()
	Return (_DateTimeFormat(@YEAR & "/" & @MON & "/" & @MDAY, 0))
EndFunc   ;==>_NowDate

;===============================================================================
;
; Description:      Returns the current Date and Time in the pc's format
; Parameter(s):     None
; Requirement(s):   None
; Return Value(s):  On Success - Date in pc's format
; Author(s):        Jos van der Zande
; Note(s):          None
;
;===============================================================================
Func _NowTime()
	Return (_DateTimeFormat(@YEAR & "/" & @MON & "/" & @MDAY & " " & @HOUR & ":" & @MIN & ":" & @SEC, 3))
EndFunc   ;==>_NowTime

;===============================================================================
;
; Description:      Converts the specified tick amount to hours, minutes, and
;                   seconds.
; Parameter(s):     $iTicks - Tick amount
;                   $iHours - Variable to store the hours (ByRef)
;                   $iMins  - Variable to store the minutes (ByRef)
;                   $iSecs  - Variable to store the seconds (ByRef)
; Requirement(s):   None
; Return Value(s):  On Success - 1
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Marc <mrd@gmx.de>
; Note(s):          None
;
;===============================================================================
Func _TicksToTime($iTicks, ByRef $iHours, ByRef $iMins, ByRef $iSecs)
	If StringIsInt($iTicks) Then
		$iTicks = Round($iTicks / 1000)
		$iHours = Int($iTicks / 3600)
		$iTicks = Mod($iTicks, 3600)
		$iMins = Int($iTicks / 60)
		$iSecs = Round(Mod($iTicks, 60))
		; If $iHours = 0 then $iHours = 24
		Return 1
	Else
		SetError(1)
		Return 0
	EndIf
EndFunc   ;==>_TicksToTime

;===============================================================================
;
; Description:      Converts the specified hours, minutes, and seconds to ticks.
; Parameter(s):     $iHours - Hours
;                   $iMins  - Minutes
;                   $iSecs  - Seconds
; Requirement(s):   None
; Return Value(s):  On Success - Converted tick amount
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Marc <mrd@gmx.de>
; Note(s):          None
;
;===============================================================================
Func _TimeToTicks($iHours, $iMins, $iSecs)
	;==============================================
	; Local Constant/Variable Declaration Section
	;==============================================
	Local $iTicks
	
	If StringIsInt($iHours) And StringIsInt($iMins) And StringIsInt($iSecs) Then
		$iTicks = 1000 * ( (3600 * $iHours) + (60 * $iMins) + $iSecs)
		Return $iTicks
	Else
		SetError(1)
		Return 0
	EndIf
EndFunc   ;==>_TimeToTicks

;===============================================================================
;
; Description:      returns an Array that contains the numbers of days per month
;                   te specified year
; Parameter(s):     $iYear
; Requirement(s):   None
; Return Value(s):  On Success - Array that contains the numbers of days per month
;                   On Failure - none
; Author(s):        Jos van der Zande / Jeremy Landes
; Note(s):          None
;
;===============================================================================
Func __DaysInMonth($iYear)
	Local $aiDays
	$aiDays = StringSplit("31,28,31,30,31,30,31,31,30,31,30,31", ",")
	If _DateIsLeapYear($iYear) Then $aiDays[2] = 29
	Return $aiDays
EndFunc   ;==>__DaysInMonth