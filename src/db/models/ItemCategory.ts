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
        unique: 'unique_category',
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: 'unique_category',
      },
      libraryNumber: {
        field: 'library_number',
        type: DataTypes.TEXT,
      },
      section: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: 'unique_category',
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
      uniqueKeys: {
        unique_category: {
          fields: ['name', 'section', 'item_type_id'],
        },
      },
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
