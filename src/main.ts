import { debug, getInput, info, setFailed, summary } from '@actions/core'
import { updateGitHubProjectItemStatus } from './update-github-project-v2-item-status'

async function run(): Promise<void> {
  try {
    // [INPUT] gh_token
    const ghToken = getInput('gh_token')
    if (ghToken !== '') {
      info('[GitHub Token GET!]')
      debug(`gh_token: ${ghToken}`)
    } else {
      throw new Error(
        '[GitHub Token NOT SUPPLIED] gh_token must be supplied. It is used to authenticate the query. It could be your Personal Access Token (PAT) (not recommended) with org permission or token generated from your GitHub app with org permission (recommended)'
      )
    }

    // [INPUT] project_id
    const projectId = getInput('project_id')
    if (projectId !== '') {
      info('[Project ID GET!]')
      debug(`project_id: ${projectId}`)
    } else {
      throw new Error(
        '[Project ID NOT SUPPLIED] project_id must be supplied. It is used to identify your GitHub Project'
      )
    }

    // [INPUT] item_ids_json
    const itemIdsJSON = getInput('item_ids_json')

    if (itemIdsJSON !== '') {
      info('[Item IDs JSON GET!]')
      debug(`item_ids_json: ${itemIdsJSON}`)
    } else {
      throw new Error(
        '[Item IDs JSON NOT SUPPLIED] item_ids_json must be supplied. They are items which you want to update their single select field.'
      )
    }

    // [INPUT] single_select_field_id
    const ssfId = getInput('single_select_field_id')

    if (ssfId !== '') {
      info('[Single Select Field ID GET!]')
      debug(`single_select_field_id: ${ssfId}`)
    } else {
      throw new Error(
        '[Single Select Field ID NOT SUPPLIED] single_select_field_id must be supplied. It is the single select field of your items which you want to update.'
      )
    }

    // [INPUT] single_select_field_option_id
    const ssfOptionId = getInput('single_select_field_option_id')

    if (ssfOptionId !== '') {
      info('[Single Select Field Option ID GET!]')
      debug(`single_select_field_option_id: ${ssfOptionId}`)
    } else {
      throw new Error(
        '[Single Select Field Option ID NOT SUPPLIED] single_select_field_option_id must be supplied. It is the new option which you want to update the supplied single select field to.'
      )
    }

    const simpleItems = await updateGitHubProjectItemStatus({
      ghToken,
      projectId,
      itemIds: JSON.parse(itemIdsJSON) as string[],
      ssfId,
      ssfOptionId
    })

    // summary
    if (simpleItems && simpleItems.length > 0) {
      const summaryDetails = summary.addHeading(
        `:rocket: Project V2 Items' ${simpleItems[0].ssfName} Updated`
      )

      summaryDetails.addRaw(
        `The following item${simpleItems.length > 1 ? 's' : ''} ${
          simpleItems[0].ssfName
        } ${simpleItems.length > 1 ? 'have' : 'has'} been updated to ${
          simpleItems[0].ssfOptionName
        } in ${simpleItems[0].projectTitle}`
      )

      summaryDetails.addList(
        simpleItems.map(
          item =>
            `<a href="${item.url}">#${item.issueOrPRNumber}</a> ${item.issueOrPRTitle}`
        )
      )

      summaryDetails.write()
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
