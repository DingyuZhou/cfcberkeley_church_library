'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { Grid } from '@mui/material'

import useTisl from 'src/hooks/useTisl'

import LanguageSwitcher from "./LanguageSwitcher"

const HeaderLink = styled(Link) `
  font-size: 30px;
  font-weight: bold;
  color: black;
  text-decoration: none;
  :hover {
    color: blue;
  }
`

export default function Footer() {
  const { getUiTisl } = useTisl()

  return (
    <div style={{ padding: '10px 0' }}>
      <Grid container justifyContent="space-between" spacing={1}>
        <Grid item>
          <HeaderLink href="/">
            {getUiTisl('CFC Berkeley Library')}
          </HeaderLink>
        </Grid>
        <Grid item>
          <div style={{ padding: '0 10px 0 0' }}>
            <LanguageSwitcher />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Link href="/member/sign-in">{getUiTisl('Admin Login')}</Link>
          <span style={{ padding: '0 15px' }}>|</span>
          <Link href="/item/donate">{getUiTisl('Donate Book')}</Link>
        </Grid>
      </Grid>
    </div>
  )
}
