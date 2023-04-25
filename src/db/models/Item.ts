const Item = (sequelize: any, DataTypes: any) => {
  const model = sequelize.define(
    'Item',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        field: 'uuid',
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      itemTypeId: {
        field: 'item_type_id',
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'item_type', key: 'id' },
      },
      itemCategoryId: {
        field: 'item_category_id',
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'item_category', key: 'id' },
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      author: {
        type: DataTypes.TEXT,
      },
      translator: {
        type: DataTypes.TEXT,
      },
      publisher: {
        type: DataTypes.TEXT,
      },
      libraryNumber: {
        field: 'library_number',
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
      },
      releasedAt: {
        field: 'released_at',
        type: DataTypes.DATE,
      },
      note: {
        type: DataTypes.TEXT,
      },
      details: {
        type: DataTypes.JSONB,
      },
      borrowedAt: {
        field: 'borrowed_at',
        type: DataTypes.DATE,
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
      tableName: 'item',
      indexes: [
        {
          unique: false,
          fields: ['item_type_id'],
        },
        {
          unique: false,
          fields: ['item_category_id'],
        },
        {
          unique: false,
          fields: ['title'],
        },
        {
          unique: false,
          fields: ['author'],
        },
        {
          unique: false,
          fields: ['translator'],
        },
        {
          unique: false,
          fields: ['publisher'],
        },
        {
          unique: false,
          fields: ['library_number'],
        },
      ],
    },
  )

  return model
}

export default Item
