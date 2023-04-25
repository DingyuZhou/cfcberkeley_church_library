import { cookies } from 'next/headers'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import Link from 'next/link'

import { getDb } from 'src/db/models'
import isAdmin from 'src/util/member/isAdmin'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'

import getItemCategories from '../getItemCategories'
import formatItemDataFromDb from '../formatItemDataFromDb'
import Main from './Main'

interface IProps {
  params: {
    uuid: string
  }
}

async function ItemPage({ params }: IProps) {
  const { uuid } = params
  const decodedUuid = decodeURI(uuid)
  const isValidUuid = (uuidValidate(decodedUuid) && uuidVersion(decodedUuid) === 4)

  let hasAdminPrivilege = false
  let item: IItem | undefined = undefined
  let itemCategories: IItemCategory[] = []
  let itemCategoryMap: IItemCategoryMap = {}

  if (isValidUuid) {
    const appCookies = cookies()
    const { models } = getDb()

    const [isCurrentMemberAdmin, itemResponse, itemCategorieInfo] = await Promise.all([
      isAdmin(appCookies),
      models.Item.findOne({ where: { uuid: decodedUuid } }),
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
      <Main
        uuid={decodedUuid}
        itemCategories={itemCategories}
        itemCategoryMap={itemCategoryMap}
        hasAdminPrivilege={hasAdminPrivilege}
        item={item}
      />
    </div>
  )
}

export default ItemPage
