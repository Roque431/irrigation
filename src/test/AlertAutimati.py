import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    """Lambda para procesamiento de alertas CloudWatch"""
    
    sns = boto3.client('sns')
    
    try:
        # Parsear el evento de CloudWatch
        message = json.loads(event['Records'][0]['Sns']['Message'])
        alarm_name = message['AlarmName']
        new_state = message['NewStateValue']
        reason = message['NewStateReason']
        
        # Determinar severidad y respuesta
        severity = determine_severity(alarm_name)
        response_team = get_response_team(severity)
        
        # Crear mensaje de alerta
        alert_message = f"""
🚨 IRRIGATION SYSTEM ALERT 🚨

Alarm: {alarm_name}
State: {new_state}
Reason: {reason}
Severity: {severity}
Time: {datetime.utcnow()}

Assigned to: {response_team}

Action required: {get_action_plan(alarm_name)}
        """
        
        # Enviar notificación
        sns.publish(
            TopicArn='arn:aws:sns:us-east-1:ACCOUNT:irrigation-alerts',
            Message=alert_message,
            Subject=f'[{severity}] Irrigation System Alert: {alarm_name}'
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps('Alert processed successfully')
        }
        
    except Exception as e:
        print(f"Error processing alert: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

def determine_severity(alarm_name):
    """Determinar severidad basado en nombre de alarma"""
    if 'Critical' in alarm_name or 'SystemDown' in alarm_name:
        return 'CRITICAL'
    elif 'High' in alarm_name or 'Performance' in alarm_name:
        return 'HIGH'
    elif 'Medium' in alarm_name:
        return 'MEDIUM'
    else:
        return 'LOW'

def get_response_team(severity):
    """Asignar equipo de respuesta"""
    teams = {
        'CRITICAL': '@channel - All hands',
        'HIGH': '@here - Senior developers',
        'MEDIUM': 'On-call engineer',
        'LOW': 'Next business day'
    }
    return teams.get(severity, 'Support team')

def get_action_plan(alarm_name):
    """Plan de acción según tipo de alarma"""
    actions = {
        'HighCPUUtilization': 'Check application performance, consider scaling',
        'DatabaseConnections': 'Review connection pool, restart if needed',
        'IoTConnectivity': 'Check sensor network, validate data flow',
        'APILatency': 'Review slow queries, check infrastructure',
        'SystemUptime': 'Immediate investigation required - system may be down'
    }
    
    for key, action in actions.items():
        if key in alarm_name:
            return action
    
    return 'Review logs and investigate root cause'