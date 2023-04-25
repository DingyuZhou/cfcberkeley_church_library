const ItemType = (sequelize: any, DataTypes: any) => {
  const model = sequelize.define(
    'ItemType',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        field: 'name',
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      details: {
        field: 'details',
        type: DataTypes.JSONB,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('now'),
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('now'),
      },
    },
    {
      tableName: 'item_type',
    },
  )

  return model
}

export default ItemType
