import boto3
import json
import time
from datetime import datetime, timedelta

class IrrigationMonitor:
    def _init_(self):
        self.cloudwatch = boto3.client('cloudwatch')
        self.logs = boto3.client('logs')
        
    def publish_mtbf_metric(self, component, mtbf_hours):
        """Publicar métrica MTBF personalizada"""
        try:
            self.cloudwatch.put_metric_data(
                Namespace='IrrigationSystem/Reliability',
                MetricData=[
                    {
                        'MetricName': 'MTBF_Hours',
                        'Dimensions': [
                            {
                                'Name': 'Component',
                                'Value': component
                            }
                        ],
                        'Value': mtbf_hours,
                        'Unit': 'Count',
                        'Timestamp': datetime.utcnow()
                    }
                ]
            )
            print(f"MTBF metric published: {component} = {mtbf_hours} hours")
        except Exception as e:
            print(f"Error publishing MTBF: {e}")
    
    def publish_mttr_metric(self, incident_type, mttr_minutes):
        """Publicar métrica MTTR personalizada"""
        try:
            self.cloudwatch.put_metric_data(
                Namespace='IrrigationSystem/Recovery',
                MetricData=[
                    {
                        'MetricName': 'MTTR_Minutes',
                        'Dimensions': [
                            {
                                'Name': 'IncidentType',
                                'Value': incident_type
                            }
                        ],
                        'Value': mttr_minutes,
                        'Unit': 'Count',
                        'Timestamp': datetime.utcnow()
                    }
                ]
            )
            print(f"MTTR metric published: {incident_type} = {mttr_minutes} minutes")
        except Exception as e:
            print(f"Error publishing MTTR: {e}")
    
    def calculate_system_uptime(self):
        """Calcular uptime del sistema"""
        try:
            # Query CloudWatch logs para errores críticos
            response = self.logs.describe_log_streams(
                logGroupName='/irrigation-system/application',
                orderBy='LastEventTime',
                descending=True,
                limit=50
            )
            
            # Lógica para calcular uptime basado en logs
            total_uptime = 99.5  # Placeholder - implementar lógica real
            
            self.cloudwatch.put_metric_data(
                Namespace='IrrigationSystem/Availability',
                MetricData=[
                    {
                        'MetricName': 'SystemUptime',
                        'Value': total_uptime,
                        'Unit': 'Percent',
                        'Timestamp': datetime.utcnow()
                    }
                ]
            )
            return total_uptime
        except Exception as e:
            print(f"Error calculating uptime: {e}")
            return 0
    
    def monitor_iot_sensors(self):
        """Monitorear conectividad sensores IoT"""
        try:
            # Simular datos de sensores - reemplazar con lógica real
            sensors_online = 8
            total_sensors = 10
            connectivity_rate = (sensors_online / total_sensors) * 100
            
            self.cloudwatch.put_metric_data(
                Namespace='IrrigationSystem/IoT',
                MetricData=[
                    {
                        'MetricName': 'SensorConnectivity',
                        'Value': connectivity_rate,
                        'Unit': 'Percent'
                    },
                    {
                        'MetricName': 'SensorsOnline',
                        'Value': sensors_online,
                        'Unit': 'Count'
                    }
                ]
            )
            return connectivity_rate
        except Exception as e:
            print(f"Error monitoring IoT sensors: {e}")
            return 0

# Script de ejecución
if _name_ == "_main_":
    monitor = IrrigationMonitor()
    
    # Ejecutar monitoreo cada 5 minutos
    while True:
        monitor.calculate_system_uptime()
        monitor.monitor_iot_sensors()
        monitor.publish_mtbf_metric("System", 720)  # Actualizar con cálculo real
        monitor.publish_mttr_metric("Critical", 25)  # Actualizar con cálculo real
        
        time.sleep(300)  # 5 minutos