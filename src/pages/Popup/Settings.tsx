import React from 'react'


type SettingsProps = {}

const Settings: React.FC<SettingsProps> = () => {

  chrome.storage.sync.get('options', (data) => {
    console.log(data)
  });

  return (
    <div>
      Settings
    </div>
  )
}

export default Settings
