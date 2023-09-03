import { cookies } from 'next/headers'
import Link from 'next/link'

import { getDb } from 'src/db/models'
import isAdmin from 'src/util/member/isAdmin'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'

import getItemCategories from '../../getItemCategories'
import formatItemDataFromDb from '../../formatItemDataFromDb'
import ItemDetailsUiWithAdminActions from './ItemDetailsUiWithAdminActions'

interface IProps {
  params: {
    itemIdOrUuid: string
  }
}

async function ItemPage({ params }: IProps) {
  const { itemIdOrUuid } = params
  const itemId = parseInt(itemIdOrUuid) || 0

  let hasAdminPrivilege = false
  let item: IItem | undefined = undefined
  let itemCategories: IItemCategory[] = []
  let itemCategoryMap: IItemCategoryMap = {}

  if (itemId && itemId.toString() === itemIdOrUuid) {
    const appCookies = cookies()
    const { models } = getDb()

    const [isCurrentMemberAdmin, itemResponse, itemCategorieInfo] = await Promise.all([
      isAdmin(appCookies),
      models.Item.findOne({ where: { id: itemId } }),
      getItemCategories(),
    ])

    hasAdminPrivilege = isCurrentMemberAdmin
    itemCategories = itemCategorieInfo.itemCategories
    itemCategoryMap = itemCategorieInfo.itemCategoryMap

    if (itemResponse) {
      item = formatItemDataFromDb(itemResponse, itemCategoryMap)
    }
  }

  return (
    <div>
      <div>
        <Link href="/member/sign-in">Sign In</Link>
      </div>
      <ItemDetailsUiWithAdminActions
        uuid={item?.uuid || ''}
        itemCategories={itemCategories}
        itemCategoryMap={itemCategoryMap}
        hasAdminPrivilege={hasAdminPrivilege}
        hasBorrowButton={false}
        item={item}
      />
    </div>
  )
}

export default ItemPage
