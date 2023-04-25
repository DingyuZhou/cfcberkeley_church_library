const ItemCategory = (sequelize: any, DataTypes: any) => {
  const model = sequelize.define(
    'ItemCategory',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      itemTypeId: {
        field: 'item_type_id',
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'item_type', key: 'id' },
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      libraryNumber: {
        field: 'library_number',
        type: DataTypes.TEXT,
      },
      section: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.TEXT,
      },
      details: {
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
      tableName: 'item_category',
      indexes: [
        {
          unique: false,
          fields: ['item_type_id'],
        },
        {
          unique: false,
          fields: ['library_number'],
        },
        {
          unique: false,
          fields: ['section'],
        },
      ],
    },
  )

  return model
}

export default ItemCategory
