import React, { useState } from 'react'
import {
  Box,
  Text,
  Select,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Textarea,
} from '@chakra-ui/react'

function NewClientQuestions() {
  const [reasonForChoosing, setReasonForChoosing] = useState('')
  const [whoToThank, setWhoToThank] = useState('')
  const [firstEyeExam, setFirstEyeExam] = useState('')
  const [timeSinceLastExam, setTimeSinceLastExam] = useState('')
  const [spectacleWearer, setSpectacleWearer] = useState('')
  const [contactLensWearer, setContactLensWearer] = useState('')
  const [spectacleTypes, setSpectacleTypes] = useState('')
  const [contactLensTypes, setContactLensTypes] = useState('')
  const [contactLensSchedule, setContactLensSchedule] = useState('')

  return (
    <Box padding="5" bg="white" boxShadow="md" borderRadius="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        New Client Questions
      </Text>

      <Stack spacing={5}>
        <FormControl>
          <FormLabel>Why did you choose Adelaide Eye Care?</FormLabel>
          <Select
            value={reasonForChoosing}
            onChange={(e) => setReasonForChoosing(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="advertisement">Advertisement</option>
            <option value="professional">Health Professional</option>
            <option value="friend">Friend/Family</option>
            <option value="other">Other</option>
          </Select>
          {(reasonForChoosing === 'professional' ||
            reasonForChoosing === 'friend') && (
            <Box mt={3}>
              <Input
                placeholder="Who can we thank?"
                value={whoToThank}
                onChange={(e) => setWhoToThank(e.target.value)}
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Is this your First Eye Examination?</FormLabel>
          <RadioGroup value={firstEyeExam} onChange={setFirstEyeExam}>
            <Stack direction="row">
              <Radio mx={1} value="yes">
                Yes
              </Radio>
              <Radio mx={1} value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {firstEyeExam === 'no' && (
            <Box mt={3}>
              <Input
                placeholder="Approx. how long ago?"
                value={timeSinceLastExam}
                onChange={(e) => setTimeSinceLastExam(e.target.value)}
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Do you currently wear spectacles?</FormLabel>
          <RadioGroup value={spectacleWearer} onChange={setSpectacleWearer}>
            <Stack direction="row">
              <Radio mx={1} value="yes">
                Yes
              </Radio>
              <Radio mx={1} value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {spectacleWearer === 'yes' && (
            <Box mt={3}>
              <Input
                placeholder="What types (eg multifocals, readers, Rx sunnies?)"
                value={spectacleTypes}
                onChange={(e) => setSpectacleTypes(e.target.value)}
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Do you currently wear contact lenses?</FormLabel>
          <RadioGroup
            RadioGroup
            value={contactLensWearer}
            onChange={setContactLensWearer}
          >
            <Stack direction="row">
              <Radio mx={1} value="yes">
                Yes
              </Radio>
              <Radio mx={1} value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {contactLensWearer === 'yes' && (
            <Box mt={3}>
              <Input
                mb={1}
                placeholder="What types (eg disposable, rigid, scleral)?"
                value={contactLensTypes}
                onChange={(e) => setContactLensTypes(e.target.value)}
              />
              <Input
                mb={1}
                placeholder="How often do you wear them?"
                value={contactLensSchedule}
                onChange={(e) => setContactLensSchedule(e.target.value)}
              />
            </Box>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>Is there information we should know about you?</FormLabel>
          <Textarea />
        </FormControl>
      </Stack>
    </Box>
  )
}

export default NewClientQuestions
