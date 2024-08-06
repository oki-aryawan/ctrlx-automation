# Green House Monitoring
## System Topology
<p align="center">
  <img src="imgs/topology.png" align="middle" width = "500" />
</p>

## PLC Visualization
The temperature and humidity variable generated with random value (virtual project)
<p align="center">
  <img src="imgs/vis_codesys.PNG" align="middle" width = "500" />
</p>

## NodeRED Dashboard
<p align="center">
  <img src="imgs/dashboard_nodered.PNG" align="middle" width = "500" />
</p>

## Issues
- Program loaded - EXCEPTION
  This issue caused by the visualization compiler. Change the compiler to VISU_NO_EXCEPTION_HANDLING. Go to the forum for detailed information [here](https://forge.codesys.com/forge/talk/Engineering/thread/3c14d0f00d/).

