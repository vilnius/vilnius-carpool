import React from 'react'

export const MainLayout = ({topMenu, topFilter, content, bottomMenu}) => (
    <div>
      <header>
        {topMenu}
      </header>
      <main>
        <div>{topFilter}</div>
        <div>{content}</div>
      </main>
      <bottom>
        {bottomMenu}
      </bottom>
    </div>
);
