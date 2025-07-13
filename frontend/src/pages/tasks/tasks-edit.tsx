import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/tasks/tasksSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditTasksPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'title': '',

    description: '',

    status: '',

    assigned_user: null,

    due_date: new Date(),

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { tasks } = useAppSelector((state) => state.tasks)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof tasks === 'object') {
      setInitialValues(tasks)
    }
  }, [tasks])

  useEffect(() => {
      if (typeof tasks === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (tasks)[el])
          setInitialValues(newInitialVal);
      }
  }, [tasks])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/tasks/tasks-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit tasks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit tasks'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Title"
    >
        <Field
            name="title"
            placeholder="Title"
        />
    </FormField>

    <FormField label='Description' hasTextareaHeight>
        <Field
            name='description'
            id='description'
            component={RichTextField}
        ></Field>
    </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="ToDo">ToDo</option>

            <option value="InProgress">InProgress</option>

            <option value="Done">Done</option>

        </Field>
    </FormField>

  <FormField label='AssignedUser' labelFor='assigned_user'>
        <Field
            name='assigned_user'
            id='assigned_user'
            component={SelectField}
            options={initialValues.assigned_user}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

      <FormField
          label="DueDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.due_date ?
                  new Date(
                      dayjs(initialValues.due_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'due_date': date})}
          />
      </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/tasks/tasks-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditTasksPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditTasksPage
