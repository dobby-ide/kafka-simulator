## KAFKA - SmartWatch simulator

The goal is understanding Kafka as a stream of events comes to it when there are different producers (smartwatches) and different consumers (storage, analytics, alerts)

21.03.2026

Shows a basic setup, steps and heart rate is changing based on some random factors. The smartwatch is not yet connected to anything but just logged out its state changes every seconds.

[commit 1c5f3ff71397c983c66812f498e2e3a063e3b3a0](https://github.com/dobby-ide/kafka-simulator/commit/1c5f3ff71397c983c66812f498e2e3a063e3b3a0)


<img src="assets/simulator_logs_001.png" alt="log001" width="300"/>

22.03.2026
[commit 8367092727856bcc002cffa4e639cd3b22a3f442](https://github.com/dobby-ide/kafka-simulator/commit/8367092727856bcc002cffa4e639cd3b22a3f442)

tick variable is initialized to introduce a discrete simulation clock. An activity change log is introduced.

23.03.2026

Multiple watches are used.

[commit 4b78d080dd9d7c9a435af9b12a410200b876f643](https://github.com/dobby-ide/kafka-simulator/commit/4b78d080dd9d7c9a435af9b12a410200b876f643)

<img src="assets/simulator_logs_002.png" alt="log002" width="300"/>