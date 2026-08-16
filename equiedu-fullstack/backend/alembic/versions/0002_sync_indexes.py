"""Sync indexes with ORM models."""
from alembic import op
revision='0002_sync_indexes'; down_revision='0001_initial'; branch_labels=None; depends_on=None
def upgrade():
    op.create_index('ix_login_attempts_identifier','login_attempts',['identifier'])
    op.create_index('ix_login_attempts_ip_address','login_attempts',['ip_address'])
    op.create_index('ix_audit_logs_user_id','audit_logs',['user_id'])
    op.create_index('ix_audit_logs_action','audit_logs',['action'])
def downgrade():
    op.drop_index('ix_audit_logs_action',table_name='audit_logs'); op.drop_index('ix_audit_logs_user_id',table_name='audit_logs'); op.drop_index('ix_login_attempts_ip_address',table_name='login_attempts'); op.drop_index('ix_login_attempts_identifier',table_name='login_attempts')
