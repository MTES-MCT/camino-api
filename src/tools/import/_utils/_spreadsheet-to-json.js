import * as googleSpreadSheetToJson from 'google-spreadsheet-to-json'
import credentials from '../credentials'
import fileCreate from '../../file-create'

const spreadsheetToJson = async (filePath, spreadsheetId, worksheet, cb) => {
  try {
    console.log(`Spreadsheet: ${filePath}`)
    let json = await googleSpreadSheetToJson({
      spreadsheetId,
      credentials,
      worksheet
    })

    if (cb) {
      json = cb(json)
    }

    const fileContent = JSON.stringify(json, null, 2)

    await fileCreate(filePath, fileContent)
  } catch (err) {
    console.log(err)
  }
}

export default spreadsheetToJson
