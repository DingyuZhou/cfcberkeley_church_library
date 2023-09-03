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
      borrowerId: {
        field: 'borrower_id',
        type: DataTypes.BIGINT,
        references: { model: 'book_borrower', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM(['AVAILABLE', 'BORROWED', 'DELETED', 'MISSING']),
        allowNull: false,
        defaultValue: 'AVAILABLE'
      },
      borrowedAt: {
        field: 'borrowed_at',
        type: DataTypes.DATE,
      },
      dueAt: {
        field: 'due_at',
        type: DataTypes.DATEONLY,
      },
      hasRenewed: {
        field: 'has_renewed',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        {
          unique: false,
          fields: ['status'],
        },
        {
          unique: false,
          fields: ['borrower_id'],
        },
        {
          unique: false,
          fields: ['borrowed_at'],
        },
      ],
    },
  )

  return model
}

export default Item
