import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSnapshot } from "valtio";
import Markdown from "../../../components/Markdown";
import appState from "../../../states/appState";
import { apiClient } from "../../../utils/request.util";

const Comments = dynamic(() => import("../../../components/widgets/Comments"), {
  ssr: false,
});

const SEO = dynamic(() => import("../../../components/others/SEO"))

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await apiClient(`/posts/${ctx.query.category}/${ctx.query.slug}`)
  return {
    props: {
      data,
    }
  }
}

const Post: NextPage<any> = (props) => {

  const aggregateSnapshot = (useSnapshot(appState) as any).aggregate.aggregatedData;


  return (
    <>
      <SEO
        title={props.data.title}
        description={
          props.data.summary || props.data.text.substring(0, 200)
        }
        openGraph={{
          type: 'article',
          article: {
            publishedTime: props.data.created,
            modifiedTime: props.data.modified || undefined,
            section: props.data.category.name,
            tags: props.data.tags ?? [],
          },
        }}
      />
      <section className="post-title">
        <h2>{props.data.title}</h2>
        <div className="post-meta">
          <time className="date">
            {props.data.created.split("T")[0]}
          </time>
          <span className="category">
            <Link href={`/category/${props.data.category.slug}`}>
              <span>{props.data.category.name}</span>
            </Link>
          </span>
          <span className="comments">
            <span>{props.data.comments_index}</span>
          </span>
          <span className="view">
            <span>{props.data.count.read}</span>
          </span>
        </div>
      </section>
      <Markdown source={props.data.text} images={props.data.images} toc/>
      {/* <section className="post-near"></section> */}
      <section className="post-author">
        <figure className="author-avatar">
          <img src={aggregateSnapshot.user.avatar} alt={aggregateSnapshot.user.name} width={200} height={200} />
        </figure>
        <div className="author-info">
          <h4>
            {aggregateSnapshot.user.name}
          </h4>
          <p>
            {aggregateSnapshot.user.introduce}
          </p>
        </div>
      </section>
      <section className="post-comments">
        <Comments type="Post" path={props.data.slug} id={props.data.id} />
      </section>
    </>
  )
}

export default Post;