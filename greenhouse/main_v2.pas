PROGRAM PLC_PRG
VAR
	status: BOOL; // on/off
	str_status: STRING; //system status (on/off)
	emergency: BOOL; 
	str_emergency: STRING;
	start: BOOL;
	stop: BOOL;
	str_operation: STRING; // operation status (start/stop)
	temp: DINT := 0; 
	humid: DINT := 0;
	heater: BOOL := FALSE;
	cool: BOOL := FALSE;
	humidifier: BOOL := FALSE;
	dehumidifier: BOOL := FALSE;
	heater_status: STRING := 'OFF';
	cool_status: STRING := 'OFF';
	humidifier_status: STRING := 'OFF';
	dehumidifier_status: STRING := 'OFF';
	temp_thres: DINT:= 30;
	humid_thres: DINT:= 60;
	random: DINT; // generate random data 
    seed: DINT := 12345;
    a: DINT := 22695477;
    c: DINT := 1;
    m: DINT := 2147483647;
    timer: TON; // Timer for 2 seconds
    timerInterval: TIME := T#2S; // 2-second interval
END_VAR

IF emergency THEN
	str_emergency := 'ON';
	status := FALSE;
ELSE
	str_emergency := 'OFF';	
END_IF;

timer(IN := TRUE, PT:= timerInterval); 

IF status THEN
	str_status := 'ON';
	IF timer.Q THEN
		timer(IN := FALSE);
		timer(IN := TRUE);
		seed := (a * seed + c) MOD m; // random num for temp and humid
		temp := 25 + (seed MOD 21);
		seed := (a * seed + c) MOD m;
		humid := 60 + (seed MOD 21); 
	END_IF;
	IF start THEN
		str_operation := 'ON';
		IF temp > temp_thres THEN
			cool := TRUE;
			heater := FALSE;
			cool_status := 'ON';
			heater_status := 'OFF';
		ELSE
			cool := FALSE;
			heater := TRUE;
			cool_status := 'OFF';
			heater_status := 'ON';
		END_IF;
		
		IF humid > humid_thres THEN
			humidifier := FALSE;
			dehumidifier := TRUE;
			humidifier_status := 'OFF';
			dehumidifier_status := 'ON';
		ELSE
			humidifier := TRUE;
			dehumidifier := FALSE;
			humidifier_status := 'ON';
			dehumidifier_status := 'OFF';
		END_IF;
	ELSE
		str_operation := 'OFF';
	END_IF;
	
	IF stop THEN
		start := FALSE;
	END_IF;
ELSE
	str_status := 'OFF';
	str_operation := 'OFF';
	start:= FALSE;
	stop:= FALSE;
END_IF;
