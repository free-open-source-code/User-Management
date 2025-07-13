import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/tasks/tasksSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const TasksView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { tasks } = useAppSelector((state) => state.tasks)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View tasks')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View tasks')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/tasks/tasks-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Title</p>
                    <p>{tasks?.title}</p>
                </div>

                <div className={'mb-4'}>
                  <p className={'block font-bold mb-2'}>Description</p>
                  {tasks.description
                    ? <p dangerouslySetInnerHTML={{__html: tasks.description}}/>
                    : <p>No data</p>
                  }
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Status</p>
                    <p>{tasks?.status ?? 'No data'}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>AssignedUser</p>

                        <p>{tasks?.assigned_user?.firstName ?? 'No data'}</p>

                </div>

                <FormField label='DueDate'>
                    {tasks.due_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={tasks.due_date ?
                        new Date(
                          dayjs(tasks.due_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No DueDate</p>}
                </FormField>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/tasks/tasks-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

TasksView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default TasksView;
