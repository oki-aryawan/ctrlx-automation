PROGRAM selfholding
VAR
	led: BOOL;
	on: BOOL;
	off: BOOL;
	temp: UDINT;
	hum: UDINT;
	rand: DWORD := 12345;
END_VAR

 
led S= on;
led R= off;
 
IF led THEN
	rand := (rand * 12345) MOD 54321;
	temp := (rand MOD 12345) / 1000;
 
	rand := (rand * 12345) MOD 54321;
	hum := (rand MOD 12345) / 1000;
END_IF	
