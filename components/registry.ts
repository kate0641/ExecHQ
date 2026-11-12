/**
 * The component catalogue's only data source.
 *
 * Each entry is the component's own `*.states.ts` file, which imports the real
 * component. The catalogue renders what is here and nothing else, so it cannot
 * show a copy or fall out of date with the component itself.
 *
 * Adding a component to the catalogue: write `X.states.ts` next to it, then add
 * one line to this file.
 */
import {
  COMPONENT_GROUPS,
  FEATURE_AREAS,
  type ComponentGroup,
  type FeatureArea,
  type RegisteredComponent,
} from "./types";

import { mapRingsStates } from "./homepage/MapRings/MapRings.states";
import { cardCarouselStates } from "./layout/CardCarousel/CardCarousel.states";
import { stepperStates } from "./form/Stepper/Stepper.states";
import { numberFieldStates } from "./form/NumberField/NumberField.states";
import { baselineFormStates } from "./homepage/BaselineForm/BaselineForm.states";
import { linkedInMoreStates } from "./homepage/LinkedInMore/LinkedInMore.states";
import { signalPictureStates } from "./homepage/SignalPicture/SignalPicture.states";
import { badgeStates } from "./primitives/Badge/Badge.states";
import { buttonStates } from "./primitives/Button/Button.states";
import { iconStates } from "./primitives/Icon/Icon.states";
import { textLinkStates } from "./primitives/TextLink/TextLink.states";
import { wordmarkStates } from "./primitives/Wordmark/Wordmark.states";
import { logoStates } from "./primitives/Logo/Logo.states";
import { inputStates } from "./form/Input/Input.states";
import { toggleGroupStates } from "./form/ToggleGroup/ToggleGroup.states";
import { micButtonStates } from "./form/MicButton/MicButton.states";
import { chipGroupStates } from "./form/ChipGroup/ChipGroup.states";
import { panelStates } from "./layout/Panel/Panel.states";
import { placeholderStateStates } from "./layout/PlaceholderState/PlaceholderState.states";
import { stepBarStates } from "./layout/StepBar/StepBar.states";
import { sheetStates } from "./layout/Sheet/Sheet.states";
import { drawerStates } from "./layout/Drawer/Drawer.states";
import { entryDrawerStates } from "./plan/EntryDrawer/EntryDrawer.states";
import { reportDrawerStates } from "./plan/ReportDrawer/ReportDrawer.states";
import { linkedInPictureStates } from "./plan/LinkedInPicture/LinkedInPicture.states";
import { stepHeaderStates } from "./onboarding/StepHeader/StepHeader.states";
import { stepActionsStates } from "./onboarding/StepActions/StepActions.states";
import { noticeStates } from "./onboarding/Notice/Notice.states";
import { generatingStateStates } from "./onboarding/GeneratingState/GeneratingState.states";
import { planTemplateCardStates } from "./onboarding/PlanTemplateCard/PlanTemplateCard.states";
import { welcomeSplitStates } from "./onboarding/WelcomeSplit/WelcomeSplit.states";
import { thisWeekCardStates } from "./onboarding/ThisWeekCard/ThisWeekCard.states";
import { nextStepsStates } from "./onboarding/NextSteps/NextSteps.states";
import { storyTextStates } from "./onboarding/StoryText/StoryText.states";
import { answerDrawerStates } from "./onboarding/AnswerDrawer/AnswerDrawer.states";
import { deviceKeyboardStates } from "./onboarding/DeviceKeyboard/DeviceKeyboard.states";
import { goodExampleStates } from "./onboarding/GoodExample/GoodExample.states";
import { guidePageStates } from "./onboarding/GuidePage/GuidePage.states";
import { pointListStates } from "./onboarding/PointList/PointList.states";
import { reflectionReplyStates } from "./onboarding/ReflectionReply/ReflectionReply.states";
import { recommendationCardStates } from "./onboarding/RecommendationCard/RecommendationCard.states";
import { signalSourcesStates } from "./onboarding/SignalSources/SignalSources.states";
import { storyDraftStates } from "./onboarding/StoryDraft/StoryDraft.states";
import { linkedInStepsStates } from "./onboarding/LinkedInSteps/LinkedInSteps.states";
import { linkedInUploadStates } from "./onboarding/LinkedInUpload/LinkedInUpload.states";
import { exportLinksStates } from "./onboarding/ExportLinks/ExportLinks.states";
import { chatMessageStates } from "./chat/ChatMessage/ChatMessage.states";
import { advisorMarkStates } from "./chat/AdvisorMark/AdvisorMark.states";
import { quickRepliesStates } from "./chat/QuickReplies/QuickReplies.states";
import { chatComposerStates } from "./chat/ChatComposer/ChatComposer.states";
import { loopStatusStates } from "./loop/LoopStatus/LoopStatus.states";
import { destinationStubStates } from "./layout/DestinationStub/DestinationStub.states";
import { conciergePillStates } from "./navigation/ConciergePill/ConciergePill.states";
import { conciergePanelStates } from "./navigation/ConciergePanel/ConciergePanel.states";
import { nextStepCardStates } from "./homepage/NextStepCard/NextStepCard.states";
import { entryLinkStates } from "./homepage/EntryLink/EntryLink.states";
import { briefingEditorialStates } from "./homepage/BriefingEditorial/BriefingEditorial.states";
import { sparkStates } from "./homepage/Spark/Spark.states";
import { baselineListStates } from "./homepage/BaselineList/BaselineList.states";
import { presenceCardStates } from "./homepage/PresenceCard/PresenceCard.states";
import { loopRowStates } from "./homepage/LoopRow/LoopRow.states";
import { checkInStates } from "./loop/CheckIn/CheckIn.states";
import { outcomeNextStates } from "./loop/OutcomeNext/OutcomeNext.states";
import { switchStates } from "./form/Switch/Switch.states";
import { settingsGroupStates } from "./profile/SettingsGroup/SettingsGroup.states";
import { settingsRowStates } from "./profile/SettingsRow/SettingsRow.states";
import { detailPanelStates } from "./profile/DetailPanel/DetailPanel.states";
import { deletionDetailStates } from "./profile/DeletionDetail/DeletionDetail.states";
import { notificationsDetailStates } from "./profile/NotificationsDetail/NotificationsDetail.states";
import { organizationDetailStates } from "./profile/OrganizationDetail/OrganizationDetail.states";
import { checkboxStates } from "./form/Checkbox/Checkbox.states";
import { codeFieldStates } from "./form/CodeField/CodeField.states";
import { providerButtonsStates } from "./login/ProviderButtons/ProviderButtons.states";
import { mailNotificationStates } from "./login/MailNotification/MailNotification.states";
import { signInEmailStates } from "./login/SignInEmail/SignInEmail.states";
import { accountPickerStates } from "./login/AccountPicker/AccountPicker.states";
import { planSignalPictureStates } from "./plan/PlanSignalPicture/PlanSignalPicture.states";
import { signalEntrySheetStates } from "./plan/SignalEntrySheet/SignalEntrySheet.states";
import { momentumLabeledStates } from "./plan/MomentumLabeled/MomentumLabeled.states";
import { planDirectionStates } from "./plan/PlanDirection/PlanDirection.states";
import { addToPlanSheetStates } from "./plan/AddToPlanSheet/AddToPlanSheet.states";
import { planGuidedStates } from "./plan/PlanGuided/PlanGuided.states";
import { stageCheckInStates } from "./plan/StageCheckIn/StageCheckIn.states";
import { checkInRecapStates } from "./plan/CheckInRecap/CheckInRecap.states";
import { planAgendaStates } from "./plan/PlanAgenda/PlanAgenda.states";

import { readActionsStates } from "./briefing/ReadActions/ReadActions.states";
import { briefingReaderStates } from "./briefing/BriefingReader/BriefingReader.states";
import { publisherPickerStates } from "./briefing/PublisherPicker/PublisherPicker.states";
import { briefingArticleStates } from "./briefing/BriefingArticle/BriefingArticle.states";
import { respondLinkStates } from "./briefing/RespondLink/RespondLink.states";
import { sourceLabelStates } from "./briefing/SourceLabel/SourceLabel.states";
import { readCounterStates } from "./briefing/ReadCounter/ReadCounter.states";
import { briefingEndStates } from "./briefing/BriefingEnd/BriefingEnd.states";
import { toolUseCaseStates } from "./playbook/ToolUseCase/ToolUseCase.states";
import { inputPanelStates } from "./playbook/InputPanel/InputPanel.states";
import { pickAnswerStates } from "./playbook/PickAnswer/PickAnswer.states";
import { enricherCardStates } from "./playbook/EnricherCard/EnricherCard.states";
import { outletCardStates } from "./playbook/OutletCard/OutletCard.states";
import { sendStepsStates } from "./playbook/SendSteps/SendSteps.states";
import { outletSuggestionsStates } from "./playbook/OutletSuggestions/OutletSuggestions.states";
import { draftEditorStates } from "./playbook/DraftEditor/DraftEditor.states";
import { revisionControlsStates } from "./playbook/RevisionControls/RevisionControls.states";
import { versionHistoryStates } from "./playbook/VersionHistory/VersionHistory.states";
import { draftUseBarStates } from "./playbook/DraftUseBar/DraftUseBar.states";
import { toolPickerStates } from "./playbook/ToolPicker/ToolPicker.states";
import { iconRowStates } from "./navigation/IconRow/IconRow.states";
import { libraryEmptyStates } from "./playbook/LibraryEmpty/LibraryEmpty.states";
import { pinnedDraftStates } from "./playbook/PinnedDraft/PinnedDraft.states";
import { dropdownMenuStates } from "./form/DropdownMenu/DropdownMenu.states";
import { listStates } from "./layout/List/List.states";
import { toolIllustrationStates } from "./playbook/ToolIllustration/ToolIllustration.states";
import { libraryFolderStates } from "./playbook/LibraryFolder/LibraryFolder.states";
import { librarySearchStates } from "./playbook/LibrarySearch/LibrarySearch.states";
import { libraryTabsStates } from "./playbook/LibraryTabs/LibraryTabs.states";
import { briefingPictureStates } from "./briefing/BriefingPicture/BriefingPicture.states";
import { briefingFrontStates } from "./briefing/BriefingFront/BriefingFront.states";
import { cohortFigureStates } from "./enterprise/CohortFigure/CohortFigure.states";
import { profileLinkStates } from "./enterprise/ProfileLink/ProfileLink.states";
import { readinessBarsStates } from "./enterprise/ReadinessBars/ReadinessBars.states";
import { readinessCheckInStates } from "./homepage/ReadinessCheckIn/ReadinessCheckIn.states";
import { sliderStates } from "./form/Slider/Slider.states";
import { dateRangePickerStates } from "./enterprise/DateRangePicker/DateRangePicker.states";
import { inviteCodeStates } from "./enterprise/InviteCode/InviteCode.states";
import { cohortFormStates } from "./enterprise/CohortForm/CohortForm.states";
import { weeklyTrendStates } from "./enterprise/WeeklyTrend/WeeklyTrend.states";
import { meterStates } from "./enterprise/Meter/Meter.states";
import { figurePopoverStates } from "./enterprise/FigurePopover/FigurePopover.states";
export const registry: RegisteredComponent[] = [
  badgeStates,
  buttonStates,
  iconStates,
  textLinkStates,
  wordmarkStates,
  logoStates,
  inputStates,
  toggleGroupStates,
  micButtonStates,
  chipGroupStates,
  dropdownMenuStates,
  panelStates,
  placeholderStateStates,
  stepBarStates,
  sheetStates,
  listStates,
  drawerStates,
  stepHeaderStates,
  stepActionsStates,
  noticeStates,
  generatingStateStates,
  planTemplateCardStates,
  welcomeSplitStates,
  thisWeekCardStates,
  nextStepsStates,
  storyTextStates,
  signalSourcesStates,
  guidePageStates,
  goodExampleStates,
  answerDrawerStates,
  deviceKeyboardStates,
  pointListStates,
  reflectionReplyStates,
  recommendationCardStates,
  storyDraftStates,
  linkedInStepsStates,
  linkedInUploadStates,
  exportLinksStates,
  chatMessageStates,
  advisorMarkStates,
  quickRepliesStates,
  chatComposerStates,
  loopStatusStates,
  destinationStubStates,
  conciergePillStates,
  conciergePanelStates,
  nextStepCardStates,
  entryLinkStates,
  mapRingsStates,
  cardCarouselStates,
  signalPictureStates,
  stepperStates,
  numberFieldStates,
  baselineFormStates,
  linkedInMoreStates,
  briefingEditorialStates,
  presenceCardStates,
  baselineListStates,
  sparkStates,
  loopRowStates,
  checkInStates,
  outcomeNextStates,
  switchStates,
  settingsGroupStates,
  settingsRowStates,
  detailPanelStates,
  deletionDetailStates,
  notificationsDetailStates,
  organizationDetailStates,
  checkboxStates,
  codeFieldStates,
  providerButtonsStates,
  mailNotificationStates,
  signInEmailStates,
  accountPickerStates,
  planSignalPictureStates,
  entryDrawerStates,
  reportDrawerStates,
  linkedInPictureStates,
  signalEntrySheetStates,
  momentumLabeledStates,
  planDirectionStates,
  addToPlanSheetStates,
  planGuidedStates,
  stageCheckInStates,
  checkInRecapStates,
  planAgendaStates,
  readActionsStates,
  briefingReaderStates,
  publisherPickerStates,
  briefingArticleStates,
  respondLinkStates,
  sourceLabelStates,
  readCounterStates,
  briefingEndStates,
  toolUseCaseStates,
  inputPanelStates,
  pickAnswerStates,
  enricherCardStates,
  outletCardStates,
  sendStepsStates,
  outletSuggestionsStates,
  draftEditorStates,
  revisionControlsStates,
  versionHistoryStates,
  draftUseBarStates,
  toolPickerStates,
  iconRowStates,
  libraryEmptyStates,
  pinnedDraftStates,
  toolIllustrationStates,
  libraryFolderStates,
  librarySearchStates,
  libraryTabsStates,
  briefingPictureStates,
  briefingFrontStates,
  cohortFigureStates,
  profileLinkStates,
  readinessBarsStates,
  readinessCheckInStates,
  sliderStates,
  dateRangePickerStates,
  inviteCodeStates,
  cohortFormStates,
  weeklyTrendStates,
  meterStates,
  figurePopoverStates,
];

/** URL-safe id for a component, used for catalogue deep links. */
export function componentId(component: RegisteredComponent): string {
  return component.name.toLowerCase();
}

export function getComponent(id: string): RegisteredComponent | undefined {
  return registry.find((component) => componentId(component) === id);
}

/** The core library grouped by type, in the order declared in `types.ts`,
 *  with empty groups dropped. Feature pieces are left out; see
 *  `registryByFeature`. */
export function registryByGroup(
  components: RegisteredComponent[] = registry
): { group: ComponentGroup; components: RegisteredComponent[] }[] {
  return COMPONENT_GROUPS.map((group) => ({
    group,
    components: components
      .filter((component) => !component.feature && component.group === group)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((entry) => entry.components.length > 0);
}

/** Components one feature alone uses, grouped by that feature. */
export function registryByFeature(
  components: RegisteredComponent[] = registry
): { feature: FeatureArea; components: RegisteredComponent[] }[] {
  return FEATURE_AREAS.map((feature) => ({
    feature,
    components: components
      .filter((component) => component.feature === feature)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((entry) => entry.components.length > 0);
}
