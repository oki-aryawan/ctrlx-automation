PROGRAM PLC_PRG
VAR
	status: BOOL; str_status: STRING;
	start: BOOL; stop: BOOL;
	str_operation: STRING;
	temp: DINT := 0; 
	heater: BOOL := FALSE;
	cool: BOOL := FALSE;
	humidifier: BOOL := FALSE;
	dehumidifier: BOOL := FALSE;
	heater_status: STRING := 'OFF';
	cool_status: STRING := 'OFF';
	temp_thres: DINT:= 30;
	random: DINT;
    seed: DINT := 12345;
    a: DINT := 22695477;
    c: DINT := 1;
    m: DINT := 2147483647;
    timer: TON;
    timerInterval: TIME := T#2S;
END_VAR

timer(IN := TRUE, PT:= timerInterval); 
IF status THEN
	str_status := 'ON';
	IF timer.Q THEN
		timer(IN := FALSE); timer(IN := TRUE);
		seed := (a * seed + c) MOD m;
		temp := 25 + (seed MOD 21);
	END_IF;
	IF start THEN
		str_operation := 'ON';
		IF temp > temp_thres THEN
			cool := TRUE; cool_status := 'ON';
			heater := FALSE; heater_status := 'OFF';
		ELSE
			cool := FALSE; cool_status := 'OFF';
			heater := TRUE; heater_status := 'ON';
		END_IF;
	ELSE
		str_operation := 'OFF';
	END_IF;
	IF stop THEN
		start := FALSE;
	END_IF;
ELSE
	start := FALSE; stop := FALSE; str_status := 'OFF';
END_IF;
